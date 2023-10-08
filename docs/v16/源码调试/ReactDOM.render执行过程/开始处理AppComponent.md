---
sidebar_position: 3
---

## `workLoopSync` 循环

```jsx
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

React 更新 fiber，首先从 `HostRoot` 开始，可以理解为所有 fiber 树都有一个虚拟的 `root fiber`，处理完该 `HostRoot` 之后 `workInProgress` 会返回其下的第一个子元素，也就是示例代码里的 `App Component`。

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181120551.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181120551.png)

## `beginWork` 开始处理

经过一系列调用后，`workLoopSync` 最终还是会进入到 `beginWork` 中。然后根据 `workInProgress.tag` 判断不同的类型，调用不同的更新函数进行处理，此处调用 `updateClassComponent` 函数。

```jsx
function beginWork(current, workInProgress, renderExpirationTime) {
  var updateExpirationTime = workInProgress.expirationTime;

  workInProgress.expirationTime = NoWork;

  switch (workInProgress.tag) {
    case ClassComponent:
      {
        var _Component2 = workInProgress.type;
        var _unresolvedProps = workInProgress.pendingProps;

        var _resolvedProps = workInProgress.elementType === _Component2 ? _unresolvedProps : resolveDefaultProps(_Component2, _unresolvedProps);

        return updateClassComponent(current, workInProgress, _Component2, _resolvedProps, renderExpirationTime);
      }
  }
}
```

此时各变量状态如下：

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181340849.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181340849.png)

此时`current = null`， `workInProgress` 即为更新 `HostRoot` 时创建的 `child Fiber` 即 `HostRoot.child = workInProgress` 。

由下图可以看出，`workInProgress.return` 即为 `tag` 等于 3 的 `HostRoot`。

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181349179.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181349179.png)

## `updateClassComponent` 更新 Class 组件

```jsx
function updateClassComponent(current, workInProgress, Component, nextProps, renderExpirationTime) {
  // workInProgress 是刚新建的 fiber，这是它第一次进入更新流程，所以 stateNode 不存在，instance = null
  var instance = workInProgress.stateNode;
  var shouldUpdate;

  // 第一次更新 instance 不存在，会进入第一个 if 条件中
  if (instance === null) {
    constructClassInstance(workInProgress, Component, nextProps);
    mountClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
    shouldUpdate = true;
  }

	// 获取下一个需要处理的child
  var nextUnitOfWork = finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderExpirationTime);

  return nextUnitOfWork;
}
```

## `constructClassInstance`

初始化 class 组件，主要是 new 一下。

```jsx
function constructClassInstance(workInProgress, ctor, props) {
	// new 一下 Class Component
  var instance = new ctor(props, context);
  var state = workInProgress.memoizedState = instance.state !== null && instance.state !== undefined ? instance.state : null;
	
  // 挂载 updater 对象，关联 workInProgress 和 instance
  adoptClassInstance(workInProgress, instance);

  return instance;
}
```

其中 `ctor` 即为传入的 App Component：

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181400062.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181400062.png)

初始化 Class 后的实例如下图所示，即为 React 组件包中的 Component 组件实例，

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181403402.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181403402.png)

经过 `adoptClassInstance` 函数处理后的 `instance` 如下图所示：

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181417491.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181417491.png)

## `adoptClassInstance`

用来给刚初始化的 Class 实例挂载 `updater`，同时将 `fiber.stateNode` 与 `instance` 关联。

```jsx
function adoptClassInstance(workInProgress, instance) {
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance; // The instance needs access to the fiber so that it can schedule updates

  set(instance, workInProgress);

  {
    instance._reactInternalInstance = fakeInternalInstance;
  }
}
```

updater 为 Class Component 组件内部属性，主要用来提供给 `setState`, `forceUpdate` 调用

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181409176.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181409176.png)

`workInProgress` 与对应的实例也有指针相互关联：

- `workInProgress.stateNode = instance`
- `instance._reactInternalFiber = workInProgress`

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181413683.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181413683.png)

## `classComponentUpdater`

```jsx
var classComponentUpdater = {
  isMounted: isMounted,
  // 提供给 setState 调用
  enqueueSetState: function (inst, payload, callback) {
    var fiber = get(inst);
    var currentTime = requestCurrentTimeForUpdate();
    var suspenseConfig = requestCurrentSuspenseConfig();
    var expirationTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);
    var update = createUpdate(expirationTime, suspenseConfig);
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback, 'setState');
      }

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  },
  enqueueReplaceState: function (inst, payload, callback) {
    var fiber = get(inst);
    var currentTime = requestCurrentTimeForUpdate();
    var suspenseConfig = requestCurrentSuspenseConfig();
    var expirationTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);
    var update = createUpdate(expirationTime, suspenseConfig);
    update.tag = ReplaceState;
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback, 'replaceState');
      }

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  },
  // 提供给 forceUpdate 调用
  enqueueForceUpdate: function (inst, callback) {
    var fiber = get(inst);
    var currentTime = requestCurrentTimeForUpdate();
    var suspenseConfig = requestCurrentSuspenseConfig();
    var expirationTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);
    var update = createUpdate(expirationTime, suspenseConfig);
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback, 'forceUpdate');
      }

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  }
};
```

## `mountClassInstance`

执行 `ClassComponent` 的一些生命周期。

经历过初始化后的 `workInProgress` 会存在对应的实例 `instance`。

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181422394.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309181422394.png)

```jsx
function mountClassInstance(workInProgress, ctor, newProps, renderExpirationTime) {
  var instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;
  initializeUpdateQueue(workInProgress);

  // 第一次初始化 updateQueue 为空，state 和 props 也不会变化，都为 Null
  processUpdateQueue(workInProgress, newProps, instance, renderExpirationTime);
  instance.state = workInProgress.memoizedState;

	// 判断如果有 getDerivedStateFromProps 方法就执行
  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
    instance.state = workInProgress.memoizedState;
  } // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.

	// 执行 callComponentWillMount 对应的方法
  if (typeof ctor.getDerivedStateFromProps !== 'function' && typeof instance.getSnapshotBeforeUpdate !== 'function' && (typeof instance.UNSAFE_componentWillMount === 'function' || typeof instance.componentWillMount === 'function')) {
    callComponentWillMount(workInProgress, instance); // If we had additional state updates during this life-cycle, let's
    // process them now.

    processUpdateQueue(workInProgress, newProps, instance, renderExpirationTime);
    instance.state = workInProgress.memoizedState;
  }

	// 如果有 componentDidMount 存在就打一个标，到后边 commit 完成时执行
  if (typeof instance.componentDidMount === 'function') {
    workInProgress.effectTag |= Update;
  }
}
```

## `initializeUpdateQueue` 初始化

主要是以 `fiber.memoizedState` 初始化 `fiber.updateQueue`。

```jsx
function initializeUpdateQueue(fiber) {
  var queue = {
    baseState: fiber.memoizedState,
    baseQueue: null,
    shared: {
      pending: null
    },
    effects: null
  };
  fiber.updateQueue = queue;
}
```

## `finishClassComponent`

执行 `ClassComponent` 的 `render` 方法，也就是该 `fiber` 的 `child` ，然后执行 `reconcileChildren` 。

```jsx
function finishClassComponent(
  current,
  workInProgress,
  Component,
  shouldUpdate,
  hasContext,
  renderExpirationTime
) {
  // 获取 ClassComponent 实例
  var instance = workInProgress.stateNode; // Rerender

  ReactCurrentOwner$1.current = workInProgress;
  var nextChildren;

	// 调用 ClassComponent 的 render 方法获取到 JSX DOM 对象
  nextChildren = instance.render();

	// 打标
  workInProgress.effectTag |= PerformedWork;

	// 调度处理
  reconcileChildren(
    current,
    workInProgress,
    nextChildren,
    renderExpirationTime
  );

  workInProgress.memoizedState = instance.state; // The context might have changed so we need to recalculate it.

  return workInProgress.child;
}
```

`nextChildren` 即为 `render` 函数返回的 `JSX DOM` 对象

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309191054732.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309191054732.png)

## `reconcileChildren`

对于 `ClassComponent` 组件第一次更新来说，`current = null`，所以会进入第一个 if 条件中，也就是会执行  `mountChildFibers` 方法。

```jsx
function reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderExpirationTime);
  } else {
	  // other code ...  
  }
}
```

## `mountChildFibers`

传进来的 `nextChildren` 是个 JSX 对象，会进入对象处理的逻辑中。

```jsx
function reconcileChildFibers(returnFiber, currentFirstChild, newChild, expirationTime) {
    var isObject = typeof newChild === 'object' && newChild !== null;

    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, expirationTime));
      }
    }

    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }
```

## `reconcileSingleElement`

传入参数如下：

- `returnFiber`：当前处理的 fiber 对象，也就是 App 类组件对应的 fiber 对象
- `currentFirstChild`：null，第一次处理不存在子节点，所以为 null
- `element`：App 类组件 render 函数返回的 JSX DOM 对象
- `expirationTime`：1073741823

```jsx
function reconcileSingleElement(
  returnFiber,
  currentFirstChild,
  element,
  expirationTime
) {
	// 根据 element 创建对应的 fiber 
  var _created4 = createFiberFromElement(
    element,
    returnFiber.mode,
    expirationTime
  );

	// 标注新常见 fiber 组件的 return 属性
  _created4.return = returnFiber;

  return _created4;
}
```

新创建的 fiber 如下图所示，起 return 属性指向 App 类组件

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309191115324.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309191115324.png)