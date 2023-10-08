---
sidebar_position: 2
---

## 获取workInProgress

在 `prepareFreshStack` 函数内部，会先复制一份 `HostRoot` 作为 `workInProgress` ，每次更新也是从 `HostRoot` 开始。

```jsx
// root.current 代表 HostRoot，即为所有 fiber 的最顶层
workInProgress = createWorkInProgress(root.current, null);
```

页面第一次`render`时，只有`HostRoot`对应的`workInProgress`是存在的，其他子级`fiber`对应的`workInProgress`都是`null`，需要新建。

## `workLoopSync` 循环处理

`workLoopSync` 会对`fiber`进行循环处理，第一次进入的是 `HostRoot` 对应的 `workInProgress` 具体结构信息如下图所示

```jsx
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

![HostRoot对应workInProgress](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309050955778.png)

HostRoot对应workInProgress

## `performUnitOfWork` 处理每一个fiber

对每一个 `fiber` 进行处理，主要是调用 `beginWork` 对 `fiber` 进行对比处理，复用生成新的 `fiber`，处理完成后调用 `completeUnitOfWork` 生成新的DOM对象。各个DOM的层级关系也是在这里确定的，等 `commit` 阶段是一下子把顶层DOM节点提交到 `root` 下。

```jsx
function performUnitOfWork(unitOfWork) {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  // HostRoot 作为最顶层的 fiber 是存在 current 的，所以此时 current 不为空
  // 但是因为 unitOfWork 是以 HostRoot 的 fiber 生成的，所以两者属性完全相同
  var current = unitOfWork.alternate;

  var next;

	// 对fiber进行处理，包括生成新的fiber，对fiber进行对比复用
  next = beginWork$1(current, unitOfWork, renderExpirationTime$1);

	// 对 fiber 进行处理可以理解为将 pending 上的东西处理后挂在 memoized 上
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
		// 完成对fiber的处理，报错生成新的DOM对象
    next = completeUnitOfWork(unitOfWork);
  }

  ReactCurrentOwner$2.current = null;
  return next;
}
```

## `beginWork` 开始任务

调用 `beginWork` 开始处理 `fiber`，因为是第一次更新，所以也不涉及 `props` 更新，只有对 `fiber` 的处理。

```jsx
function beginWork(current, workInProgress, renderExpirationTime) {
	// 1073741823 同步更新时间戳，是最高优先级了
  var updateExpirationTime = workInProgress.expirationTime; 

	// 因为已经把 expirationTime 拿出来了，所以可以重置了
  workInProgress.expirationTime = NoWork;

  switch (workInProgress.tag) {
    case HostRoot: // 3
      return updateHostRoot(current, workInProgress, renderExpirationTime);
  }
}
```

## `updateHostRoot` 处理 `HostRoot`

```jsx
function updateHostRoot(current, workInProgress, renderExpirationTime) {
  // updateQueue 上挂载了最开始那个 update，也就是 update.payload = element
  var updateQueue = workInProgress.updateQueue;

	// 全是 null
  var nextProps = workInProgress.pendingProps;
  var prevState = workInProgress.memoizedState;
  var prevChildren = prevState !== null ? prevState.element : null;

	// Clone the update queue from current. Unless it's already a clone.
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderExpirationTime);

	// 经过 processUpdateQueue 计算，此时 workInProgress.memoizedState = { element }
  var nextState = workInProgress.memoizedState; // Caution: React DevTools currently depends on this property
  // being called "element".

	// nextChildren 即为 App ClassComponent
  var nextChildren = nextState.element;

	// 获取顶层 root
  var root = workInProgress.stateNode;

  reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime);
  resetHydrationState();

	// 这里返回了 child
  return workInProgress.child;
}
```

![经过 `processUpdateQueue` 计算后的 `workInProgress`](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051106798.png)

经过 `processUpdateQueue` 计算后的 `workInProgress`

## `cloneUpdateQueue`

代码里的应为注释解释的很清楚：

- 如果 `current` 和 `workInProgress` 上的 `updateQueue` 是相同的，就把 `current` 上的所有 `update` 都复制给 `workInProgress` ，
- 如果不相同，也就是说不是同一个 `queue`，说明之前已经处理过，这里就不再做处理

这么做主要是为了保证 `workInProgress` 上的 `updateQueue` 必然是最新的。

```jsx
function cloneUpdateQueue(current, workInProgress) {
  // Clone the update queue from current. Unless it's already a clone.
  var queue = workInProgress.updateQueue;
  var currentQueue = current.updateQueue;

  if (queue === currentQueue) {
    var clone = {
      baseState: currentQueue.baseState,
      baseQueue: currentQueue.baseQueue,
      shared: currentQueue.shared,
      effects: currentQueue.effects
    };
    workInProgress.updateQueue = clone;
  }
}
```

## `processUpdateQueue` 处理 `updateQueue`

```jsx
function processUpdateQueue(workInProgress, props, instance, renderExpirationTime) {
  // This is always non-null on a ClassComponent or HostRoot
	// queue 此时为需要更新的 updateQueue
  var queue = workInProgress.updateQueue;

	// 第一次更新，baseQueue 为 null
  var baseQueue = queue.baseQueue; // The last pending update that hasn't been processed yet.

	// pendingQueue 代表 updateQueue 上保存的第一个 update
  var pendingQueue = queue.shared.pending;

	// 该 if 判断主要是对 updateQueue 进行一些卸载挂载
  if (pendingQueue !== null) {
    baseQueue = pendingQueue;

		// 这里不止清楚 queue 上的 update，也是清除 workInProgress.updateQueue 上的 update
		// 如果 current.updateQueue = workInProgress.updateQueue，也会把 current.updateQueue 清除
    queue.shared.pending = null; // TODO: Pass `current` as argument

    var current = workInProgress.alternate;

    if (current !== null) {
      var currentQueue = current.updateQueue;

      if (currentQueue !== null) {
				// 把原来 workInProgress.updateQueue.shared.pending 上挂的 update 挂在了 current.baseQueue
        currentQueue.baseQueue = pendingQueue;
      }
    }
  } // These values may change as we process the queue.

  if (baseQueue !== null) {
    var first = baseQueue.next; // Iterate through the list of updates to compute the result.

    var newState = queue.baseState;
    var newExpirationTime = NoWork;
    var newBaseState = null;
    var newBaseQueueFirst = null;
    var newBaseQueueLast = null;

		// 找到 queue 中第一个 update
    if (first !== null) {
      var update = first;

      do {
        var updateExpirationTime = update.expirationTime;
				
				// 计算新 State
        newState = getStateFromUpdate(workInProgress, queue, update, newState, props, instance);
        
				// callback 为 ReactDOM.render 第三个参数，页面 commit 完成后需要执行的回调
				var callback = update.callback;

        if (callback !== null) {
					// React 的更新并不是遇到一个处理一个，而是给 effectTag 打上需要更新的标志位，等后边React统一处理
          workInProgress.effectTag |= Callback;
          var effects = queue.effects;

          if (effects === null) {
						// effectTag 和 effects 是配合使用，effectTag 打标，effects 保存需要更新的操作
            queue.effects = [update];
          } else {
            effects.push(update);
          }
        }
        

        update = update.next;

        if (update === null || update === first) {
          pendingQueue = queue.shared.pending;

          if (pendingQueue === null) {
						// 这里会跳出 while 循环
            break;
          }
        }
      } while (true);
    }

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }

    queue.baseState = newBaseState;
    queue.baseQueue = newBaseQueueLast; 
		// Set the remaining expiration time to be whatever is remaining in the queue.
    // This should be fine because the only two other things that contribute to
    // expiration time are props and context. We're already in the middle of the
    // begin phase by the time we start processing the queue, so we've already
    // dealt with the props. Context in components that specify
    // shouldComponentUpdate is tricky; but we'll have to account for
    // that regardless.

		// 清除 workInProgress.expirationTime
    workInProgress.expirationTime = newExpirationTime;

		// 把刚才计算得到的 newState 挂载 workInProgress.memoizedState
    workInProgress.memoizedState = newState;
  }
}
```

![刚拿到的 pendingQueue，可以看出 `pendingQueue` 里的 update 是采用首尾相连的方式，其实此时 `pendingQueue` 里只有一个 update，保存的顶层 App 的 element](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051038133.png)

刚拿到的 pendingQueue，可以看出 `pendingQueue` 里的 update 是采用首尾相连的方式，其实此时 `pendingQueue` 里只有一个 update，保存的顶层 App 的 element

![经过处理后的queue](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051100352.png)

经过处理后的queue

- `queue.baseState`：保存 `queue.shared.pending` 上挂载的 update 的计算结果，也就是新一轮的 `State`
- `queue.effects`：保存 `update` 计算过程中需要保存的回调函数。

![处理 `updateQueue` 后得到的 `workInProgress`](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051106798.png)

处理 `updateQueue` 后得到的 `workInProgress`

可以看到 `workInProgress.memoizedState` 也保存的是计算后的 `State`。

## `getStateFromUpdate` 计算新的 `state`

页面第一次更新必然是 `UpdateState`

```jsx
function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
  switch (update.tag) {
    case UpdateState:
      {
        var _payload = update.payload;
        var partialState;

				// App ClassComponent
	      partialState = _payload;

				// 合并新老 State 并返回，由此可以看到，每次更新 State，返回的都是一个新对象
        return _assign({}, prevState, partialState);
      }
  }

  return prevState;
}
```

![`partialState` 上保存的 element, 也就是 App 类](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051054612.png)

`partialState` 上保存的 element, 也就是 App 类

## `reconcileChildren` 进行调度

主要是处理 `child`，给每个当前处理的 `workInProgress` 挂上 `child`，以便可以深度遍历调用

```jsx
function reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime) {
  // HostRoot 的 current 是存在的，所以不会进入 if 判断中，而会调用 reconcileChildFibers 方法
	if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderExpirationTime);
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.
    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderExpirationTime);
  }
}
```

![current 上的 `updateQueue` 没有变化，因为这是一颗老树](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051115572.png)

current 上的 `updateQueue` 没有变化，因为这是一颗老树

![`workInProgress` 上的 `updateQueue` 已经清空，更新时间也清空，更新后的内容分别保存在 `memoizedState` 等不同的字段中，这是一颗新树](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051116831.png)

`workInProgress` 上的 `updateQueue` 已经清空，更新时间也清空，更新后的内容分别保存在 `memoizedState` 等不同的字段中，这是一颗新树

![`nextChildren` 是 `App ClassComponent` ，可以这么理解，HostRoot 的作用就是为了更新顶层的 `ClassComponent`](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051118868.png)

`nextChildren` 是 `App ClassComponent` ，可以这么理解，HostRoot 的作用就是为了更新顶层的 `ClassComponent`

## `reconcileChildFibers`

```jsx
function reconcileChildFibers(returnFiber, currentFirstChild, newChild, expirationTime) {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.
    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    var isUnkeyedTopLevelFragment = typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null;

    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    } // Handle object types

    var isObject = typeof newChild === 'object' && newChild !== null;

    if (isObject) {
      switch (newChild.$$typeof) {
				// 会进入这里
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, expirationTime));
      }
    }
  }
```

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051121591.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051121591.png)

```jsx
function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
    var key = element.key;
    var child = currentFirstChild;

    var _created4 = createFiberFromElement(element, returnFiber.mode, expirationTime);

    _created4.ref = coerceRef(returnFiber, currentFirstChild, element);
    _created4.return = returnFiber;
    return _created4;
  }
```

根据 element 创建的 fiber 如下：

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051127703.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051127703.png)

## `placeSingleChild`

```jsx
function placeSingleChild(newFiber) {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
		// newFiber.alternate 不存在，说明这是一个新建的 fiber
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.effectTag = Placement;
    }

    return newFiber;
  }
```

这里会进入 if 条件中，给 `newFiber` 打一个 `Placement` 的标。

![打了一个 `effectTag` 标](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309051130209.png)

打了一个 `effectTag` 标

经过了层层 `return`，最终会把新建的 `newFiber`，也就是 `workInProgess.child` 返回

## `workLoopSync` 返回下一个待处理的 `fiber`

```jsx
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

经过处理后 `workInProgress`  拿到的是下一个待处理的 `fiber`，对与 `HostRoot` 来说也就是 `App Component`。

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181120551.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181120551.png)