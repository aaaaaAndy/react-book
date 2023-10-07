## `performUnitOfWork`

该方法位于`react-reconciler/src/ReactFiberWorkLoop.js`文件中。

其核心逻辑在于：

1. 调用`beginWork`处理当前传入的`fiber`，并得到下一个需要处理的`fiber`，即`next`存值；
2. 该递归过程属于深度优先遍历，即先一层一层往下遍历子节点，所以当遍历到最深一层子节点时，`next`为空；
3. 当`next`为空时，表明深度达底部，再调用`completeUnitOfWork`返回其兄弟节点，以此来实现深度优先遍历；

```javascript
/**
 * 采用深度优先遍历的策略处理节点
 * 
 * 1. beginWork值返回当前节点的child
 * 2. 当beginWork返回的child为空时，再调用completeUnitOfWork返回其兄弟节点
 *
 * @param {Fiber} unitOfWork 需要更新的节点
 * @return {*}
 */
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  // 该fiber的当前已刷新状态是作为备用。
  // 理想情况不应该依赖于此，但是在这里依赖它意味着我们
  // 在工作进行中的不需要再一个附加字段。
  const current = unitOfWork.alternate;

  startWorkTimer(unitOfWork);
  setCurrentDebugFiberInDEV(unitOfWork);

  let next;
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork(current, unitOfWork, renderExpirationTime);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    // 调用beginWork
    next = beginWork(current, unitOfWork, renderExpirationTime);
  }

  resetCurrentDebugFiberInDEV();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(unitOfWork);
  }

  ReactCurrentOwner.current = null;
  return next;
}
```

## `completeUnitOfWork`

该方法的核心在`do...while...`代码的最后，即先返回`siblingFiber`兄弟节点，如果兄弟节点不存在，则将父节点赋值给`workInProgress`，然后继续查找父节点的兄弟节点。

```javascript
/**
 * 完成当前unit的更新工作，如标记effect链等，然后进行兄弟节点的更新，如果没有兄弟节点，就返回父节点，然后继续查找父节点的兄弟节点
 * 这是深度优先遍历的算法
 * @param unitOfWork
 * @return {Fiber|null|*}
 */
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.
  // 从下至上，移动到该节点的兄弟节点，如果一直往上没有兄弟节点，就返回父节点
  workInProgress = unitOfWork;
  do {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    // 获取当前节点
    const current = workInProgress.alternate;

    // 获取父节点
    const returnFiber = workInProgress.return;

    // Check if the work completed or if something threw.
    // 如果该节点没有异常抛出的话，即可正常执行
    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      setCurrentDebugFiberInDEV(workInProgress);
      let next;

      // 完成fiber的工作，如创建新实例，标记更新等
      // timer都是分析器，一般在开发环境才用得到，线上环境是用不到的
      if (
        !enableProfilerTimer ||
        (workInProgress.mode & ProfileMode) === NoMode
      ) {
        // 完成该节点的更新
        next = completeWork(current, workInProgress, renderExpirationTime);
      } else {
        startProfilerTimer(workInProgress);
        next = completeWork(current, workInProgress, renderExpirationTime);
        // Update render duration assuming we didn't error.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
      }
      stopWorkTimer(workInProgress);
      resetCurrentDebugFiberInDEV();

      // 更新当前fiber的childExpirationTime
      resetChildExpirationTime(workInProgress);

      // 如果next存在则表示产生了新的更新
      if (next !== null) {
        // Completing this fiber spawned new work. Work on that next.
        return next;
      }

      // 如果父节点存在，并且其Effect链没有被赋值的话
      if (
        returnFiber !== null &&
        // Do not append effects to parents if a sibling failed to complete
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        // Append all the effects of the subtree and this fiber onto the effect
        // list of the parent. The completion order of the children affects the
        // side-effect order.
        // 如果父节点没有挂载firstEffect的话，将当前节点的firstEffect赋值给父节点的firstEffect
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }

        // 如果父节点的lastEffect有值的话，将nextEffect赋值
        // 这里目的是串联Effect链
        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // If this fiber had side-effects, we append it AFTER the children's
        // side-effects. We can perform certain side-effects earlier if needed,
        // by doing multiple passes over the effect list. We don't want to
        // schedule our own side-effect on our own list because if end up
        // reusing children we'll schedule this effect onto itself since we're
        // at the end.
        // 获取副作用标记
        const effectTag = workInProgress.effectTag;

        // Skip both NoWork and PerformedWork tags when creating the effect
        // list. PerformedWork effect is read by React DevTools but shouldn't be
        // committed.
        // 如果该副作用标记大于PerformedWork，其实PerformedWork的值就是1，也就是说当前存在副作用
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            // 如果当前父节点的lastEffect不为空的时候，将当前节点挂载到父节点的副作用链最后
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            // 否则，将当前节点挂载在父节点的副作用链的firstEffect上
            returnFiber.firstEffect = workInProgress;
          }
          returnFiber.lastEffect = workInProgress;
        }
      }
    } else {
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      // 如果当前节点未能完成更新，捕获其中的错误
      const next = unwindWork(workInProgress, renderExpirationTime);

      // Because this fiber did not complete, don't reset its expiration time.

      if (
        enableProfilerTimer &&
        (workInProgress.mode & ProfileMode) !== NoMode
      ) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);

        // Include the time spent working on failed children before continuing.
        let actualDuration = workInProgress.actualDuration;
        let child = workInProgress.child;
        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }
        workInProgress.actualDuration = actualDuration;
      }

      if (next !== null) {
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        // TODO: The name stopFailedWorkTimer is misleading because Suspense
        // also captures and restarts.
        // 如果next存在，则表示产生了新的work
        stopFailedWorkTimer(workInProgress);

        // 更新其effectTag，标记是restart的
        next.effectTag &= HostEffectMask;

        // 返回next，以便执行新的work
        return next;
      }
      stopWorkTimer(workInProgress);

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        // 如果父节点存在，则将其effectTag设置为Incomplete，即未完成
        returnFiber.firstEffect = returnFiber.lastEffect = null;
        returnFiber.effectTag |= Incomplete;
      }
    }

    // 先返回兄弟节点，兄弟节点遍历完才返回父节点
    // 因为父节点已经作为爷爷节点的child更新过，所以不再更新父节点
    // 而是将workInProgress = returnFiber，进行下次循环时，返回父节点的兄弟节点
    const siblingFiber = workInProgress.sibling;
    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      return siblingFiber;
    }
    // Otherwise, return to the parent
    workInProgress = returnFiber;
  } while (workInProgress !== null);

  // We've reached the root.
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
  return null;
}

```

## `completeWork`

针对不同`Fiber`节点的`tag`进行不同的处理。

可以看到，针对`ClassComponent`也仅仅是处理了`context`。而对于`HostComponent`节点，则需要新建`dom`元素或者更新`dom`元素。

```javascript
/**
 * 为了创建好对应的dom节点插入对应的父节点dom节点，为其添加副作用标识
 * 该函数可以理解为递归节点的归阶段，只有当fiber节点没有子节点时才会进入此函数
 *
 * @param {Fiber} current fiber更新之前的状态
 * @param {Fiber} workInProgress 当前正在更新的fiber
 * @param {ExpirationTime} renderExpirationTime 过期时间，这里是赋值给了renderExpirationTime
 * @return {Fiber|null}
 */
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent: {
      const Component = workInProgress.type;
      if (isLegacyContextProvider(Component)) {
        popLegacyContext(workInProgress);
      }
      return null;
    }
    case HostRoot: {
      // code...  
    }
    case HostComponent: {
      // 首先处理context
      popHostContext(workInProgress);

      // 获取根容器，<div id="root"></div>
      const rootContainerInstance = getRootHostContainer();
      const type = workInProgress.type;

      // 这里是current存在，即不是第一次渲染，所以需要update
      if (current !== null && workInProgress.stateNode != null) {
        updateHostComponent(
          current,
          workInProgress,
          type,
          newProps,
          rootContainerInstance,
        );

        if (enableDeprecatedFlareAPI) {
          const prevListeners = current.memoizedProps.DEPRECATED_flareListeners;
          const nextListeners = newProps.DEPRECATED_flareListeners;
          if (prevListeners !== nextListeners) {
            markUpdate(workInProgress);
          }
        }

        if (current.ref !== workInProgress.ref) {
          markRef(workInProgress);
        }
      } else {
        if (!newProps) {
          invariant(
            workInProgress.stateNode !== null,
            'We must have new props for new mounts. This error is likely ' +
            'caused by a bug in React. Please file an issue.',
          );
          // This can happen when we abort work.
          return null;
        }

        const currentHostContext = getHostContext();
        // TODO: Move createInstance to beginWork and keep it on a context
        // "stack" as the parent. Then append children as we go in beginWork
        // or completeWork depending on whether we want to add them top->down or
        // bottom->up. Top->down is faster in IE11.
        let wasHydrated = popHydrationState(workInProgress);

        //  wasHydrated是服务端渲染才会用到的
        if (wasHydrated) {
          // TODO: Move this and createInstance step into the beginPhase
          // to consolidate.
          // code ...
        } else {
          // 创建dom实例
          let instance = createInstance(
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
            workInProgress,
          );

          // 将创建好的dom实例插入到dom树中
          appendAllChildren(instance, workInProgress, false, false);

          // This needs to be set before we mount Flare event listeners
          workInProgress.stateNode = instance;

          if (enableDeprecatedFlareAPI) {
            const listeners = newProps.DEPRECATED_flareListeners;
            if (listeners != null) {
              updateDeprecatedEventListeners(
                listeners,
                workInProgress,
                rootContainerInstance,
              );
            }
          }

          // Certain renderers require commit-time effects for initial mount.
          // (eg DOM renderer supports auto-focus for certain elements).
          // Make sure such renderers get scheduled for later work.
          if (
            // 初始化dom的一些属性
            finalizeInitialChildren(
              instance,
              type,
              newProps,
              rootContainerInstance,
              currentHostContext,
            )
          ) {
            markUpdate(workInProgress);
          }
        }

        if (workInProgress.ref !== null) {
          // If there is a ref on a host node we need to schedule a callback
          markRef(workInProgress);
        }
      }
      return null;
    }
  }
}
```
