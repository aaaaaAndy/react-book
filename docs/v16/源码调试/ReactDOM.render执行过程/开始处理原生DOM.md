---
sidebar_position: 4
---

## `workLoopSync`

每处理完一个 fiber ，都会再一次进入这个循环中。

```jsx
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

此时 `workInProgress` 为上一次处理生成的 fiber 对象，也就是 `render` 函数中返回的 JSX DOM 对象中的第一个 DOM。

可以看到在生成第一个 DOM 对应的 fiber 对象时，也把其子 DOM 对象作为 `pendingProps` 挂载了上去。

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309191122141.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309191122141.png)

## `beginWork`

根据 `fiber.tag` 找到对应的处理函数，进行处理。

此时参数如下：

- `current`：null
- `workInProgress`：父组件 `App ClassComponent` 调度时新建的 div fiber
- `renderExpirationTime`：1073741823

```jsx
function beginWork(current, workInProgress, renderExpirationTime) {
  var updateExpirationTime = workInProgress.expirationTime;

  workInProgress.expirationTime = NoWork;

  switch (workInProgress.tag) {
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime);
  }
}
```

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309191122141.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309191122141.png)

## `updateHostComponent`

处理原生DOM，可以看出对于原生 DOM 没有什么特别的计算，主要是调用 `reconcileChildren` 创建新的 `fiber` 。

```jsx
function updateHostComponent(current, workInProgress, renderExpirationTime) {
  pushHostContext(workInProgress);

  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }

  var type = workInProgress.type;
  var nextProps = workInProgress.pendingProps;
  var prevProps = current !== null ? current.memoizedProps : null;
  var nextChildren = nextProps.children;
  var isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also has access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.effectTag |= ContentReset;
  }

  markRef(current, workInProgress); // Check the host config to see if the children are offscreen/hidden.

  if (workInProgress.mode & ConcurrentMode && renderExpirationTime !== Never && shouldDeprioritizeSubtree(type, nextProps)) {
    {
      markSpawnedWork(Never);
    } // Schedule this fiber to re-render at offscreen priority. Then bailout.

    workInProgress.expirationTime = workInProgress.childExpirationTime = Never;
    return null;
  }

  reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime);
  return workInProgress.child;
}
```

## `shouldSetTextContent`

主要用来判断是否为 `option`、`textarea` 等子元素只能为 text 的元素

```jsx
function shouldSetTextContent(type, props) {
  return (
    type === "textarea" ||
    type === "option" ||
    type === "noscript" ||
    typeof props.children === "string" ||
    typeof props.children === "number" ||
    (typeof props.dangerouslySetInnerHTML === "object" &&
      props.dangerouslySetInnerHTML !== null &&
      props.dangerouslySetInnerHTML.__html != null)
  );
}
```

## `reconcileChildren`

调用 `mountChildFibers` 为子元素创建对应的 `fiber` 。

此时参数中的 `nextChildren` 为当前 DOM 元素的 children ，如下图所示：

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309221320377.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309221320377.png)

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

## `reconcileChildFibers`

此时传入的 `newChild` 是个数组，所以会调用 `reconcileChildrenArray` 处理。

```jsx
function reconcileChildFibers(
  returnFiber,
  currentFirstChild,
  newChild,
  expirationTime
) {
  if (isArray$1(newChild)) {
    return reconcileChildrenArray(
      returnFiber,
      currentFirstChild,
      newChild,
      expirationTime
    );
  }
}
```

## `reconcileChildrenArray`

处理数组类型子元素

```jsx
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
    var resultingFirstChild = null;
    var previousNewFiber = null;
    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;

		// oldFiber = null，所以不会进入此 for 循环中
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
	    // other code ...
    }

		// newIdx = 0，不等于 newChildren.length，所以也不会进入此 if 判断中
    if (newIdx === newChildren.length) {
      // other code ...
    }

		// 最终会进入此 if 判断中
    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
				// 针对每一个 child 创建其对应的 fiber，
        var _newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime);

        if (_newFiber === null) {
          continue;
        }

        lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);

				// 构建兄弟节点关系
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = _newFiber;
        } else {
          previousNewFiber.sibling = _newFiber;
        }

        previousNewFiber = _newFiber;
      }

      return resultingFirstChild;
    } // Add all children to a key map for quick lookups.

    var existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

    for (; newIdx < newChildren.length; newIdx++) {
      var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], expirationTime);

      if (_newFiber2 !== null) {
        if (shouldTrackSideEffects) {
          if (_newFiber2.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(_newFiber2.key === null ? newIdx : _newFiber2.key);
          }
        }

        lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = _newFiber2;
        } else {
          previousNewFiber.sibling = _newFiber2;
        }

        previousNewFiber = _newFiber2;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(function (child) {
        return deleteChild(returnFiber, child);
      });
    }

    return resultingFirstChild;
  }
```

## `completeUnitOfWork`

React 的 fiber 遍历为深度优先遍历，每次返回其 child，如果 child 不存在就会进入 `completeUnitOfWork` 方法中。

```jsx
function completeUnitOfWork(unitOfWork) {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.
  workInProgress = unitOfWork;

  do {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    var current = workInProgress.alternate;
    var returnFiber = workInProgress.return; // Check if the work completed or if something threw.

    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      setCurrentFiber(workInProgress);
      var next = void 0;

      next = completeWork(current, workInProgress, renderExpirationTime$1)

      if (next !== null) {
        // Completing this fiber spawned new work. Work on that next.
        return next;
      }
    } 

    var siblingFiber = workInProgress.sibling;

		// 如果有兄弟节点为处理，直接返回，进入 beginWork 处理		
    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      return siblingFiber;
    } // Otherwise, return to the parent

    workInProgress = returnFiber;
  } while (workInProgress !== null); // We've reached the root.

	// 所有的节点处理完成后，会复制给 workInProgressRootExitStatus 一个正常结束的状态
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }

  return null;
}
```

以本次代码为例，当处理到 h2 标签时就访问不到其 child 的，所以进入 `completeUnitOfWork` 中，参数 `unitOfWork` 如下所示：

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309221341374.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309221341374.png)

## `completeWork`

完成对 fiber 节点的处理，比如对原生 DOM 来说，根据 fiber 调用 `createElement` 创建真实的 DOM 节点，并且使用 `appendChild` 将真实 DOM 节点串联起来。

```jsx
function completeWork(current, workInProgress, renderExpirationTime) {
  var newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    // 处理原生 DOM 节点
    case HostComponent: {
      // div.root
      var rootContainerInstance = getRootHostContainer();
      var type = workInProgress.type;

			// 创建真实 DOM 节点
      var instance = createInstance(
        type,
        newProps,
        rootContainerInstance,
        currentHostContext,
        workInProgress
      );

			// 串联所有真实 DOM 节点
      appendAllChildren(instance, workInProgress, false, false); // This needs to be set before we mount Flare event listeners

			// fiber的stateNode 都保存的是该fiber对应的真实DOM节点
      workInProgress.stateNode = instance;
      // (eg DOM renderer supports auto-focus for certain elements).
      // Make sure such renderers get scheduled for later work.

      if (
				// 挂载一些属性方法，尤其是初始化一些React合成事件
        finalizeInitialChildren(instance, type, newProps, rootContainerInstance)
      ) {
        markUpdate(workInProgress);
      }

      return null;
    }
  }
}
```

创建的真实节点如下图所示：

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309221422254.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309221422254.png)

## `createInstance`

底层调用 `document.createElement` 方法创建真实DOM节点。

```jsx
function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
  var parentNamespace;
  var domElement = createElement(type, props, rootContainerInstance, parentNamespace);
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
```

## `appendAllChildren`

挂载所有子节点。

```jsx
appendAllChildren = function (parent, workInProgress, needsVisibilityToggle, isHidden) {
    // We only have the top Fiber that was created but we need recurse down its
    // children to find all the terminal nodes.
		// 通过 fiber 找到当前节点所有的子元素
    var node = workInProgress.child;

    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText) {
				// 刚才说了，所有fiber节点对应的真实DOM节点都保存在其 fiber.stateNode 上
        appendInitialChild(parent, node.stateNode);
      } else if (node.tag === HostPortal) ; else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }

      if (node === workInProgress) {
        return;
      }

			// while 循环找到 node 的所有兄弟节点，确保所有的子节点够挂在 node 上
      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress) {
          return;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  };
```