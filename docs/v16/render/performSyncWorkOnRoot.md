## `performSyncWorkOnRoot`

该方法位于`react-reconciler/src/ReactFiberWorkLoop.js`文件中。

由`scheduleWork`一篇可以知道，只有当当前任务是同步任务，切主线程有空闲时才会直接调用该`performSyncWorkOnRoot`函数来进行同步任务，这种情况一般发生在页面第一次初始化时，没有其他遗留任务，又要求尽快将页面展现出来。

该方法的很在的核心逻辑在中间的`if(wirkInProgress !== null)...else...`条件判断中，在条件判断之前都是为更新做准备。

1. 在条件判断中`executionContext |= RenderContext`标志着本次更新进入了`render`阶段；
2. `workLoopSync`方法标志着真正开始了同步更新；
3. `finishSyncRender`方法标志着`render`阶段已经完成，接下来要进入`commit`阶段。

```javascript
// This is the entry point for synchronous tasks that don't go
// through Scheduler
// 开始调度同步任务
function performSyncWorkOnRoot(root) {
  // Check if there's expired work on this root. Otherwise, render at Sync.
  // 检查是否有过期的任务，有的话，立即render或者同步执行
  const lastExpiredTime = root.lastExpiredTime;
  const expirationTime = lastExpiredTime !== NoWork ? lastExpiredTime : Sync;
  invariant(
    (executionContext & (RenderContext | CommitContext)) === NoContext,
    'Should not already be working.',
  );

  flushPassiveEffects();

  // If the root or expiration time have changed, throw out the existing stack
  // and prepare a fresh one. Otherwise we'll continue where we left off.
  // 如果root或者expirationTime已经改变，那么久丢弃掉现有的工作栈，再重新准备一个
  // 如果没有改变，那就在原来的工作栈上继续执行
  if (root !== workInProgressRoot || expirationTime !== renderExpirationTime) {
    // 准备新的堆栈
    prepareFreshStack(root, expirationTime);

    // 开始处理待处理的交互
    startWorkOnPendingInteractions(root, expirationTime);
  }

  // If we have a work-in-progress fiber, it means there's still work to do
  // in this root.
  // 如果存在workInProgress，那证明当前root还有需要工作未完成
  if (workInProgress !== null) {
    const prevExecutionContext = executionContext;
    // 标志着进入了render阶段
    executionContext |= RenderContext;
    const prevDispatcher = pushDispatcher(root);
    const prevInteractions = pushInteractions(root);
    startWorkLoopTimer(workInProgress);

    do {
      try {
        // 循环调动beginWork渲染新child
        workLoopSync();
        break;
      } catch (thrownValue) {
        handleError(root, thrownValue);
      }
    } while (true);
    resetContextDependencies();
    // 恢复原来的executionContext
    executionContext = prevExecutionContext;
    popDispatcher(prevDispatcher);
    if (enableSchedulerTracing) {
      popInteractions(((prevInteractions: any): Set<Interaction>));
    }

    // 这里是处理更新过程中报错，就调用ensureRootIsScheduled将更新放入调度队列中等待下一次尝试
    if (workInProgressRootExitStatus === RootFatalErrored) {
      const fatalError = workInProgressRootFatalError;
      stopInterruptedWorkLoopTimer();
      prepareFreshStack(root, expirationTime);
      markRootSuspendedAtTime(root, expirationTime);
      ensureRootIsScheduled(root);
      throw fatalError;
    }

    if (workInProgress !== null) {
      // This is a sync render, so we should have finished the whole tree.
      invariant(
        false,
        'Cannot commit an incomplete root. This error is likely caused by a ' +
        'bug in React. Please file an issue.',
      );
    } else {
      // We now have a consistent tree. Because this is a sync render, we
      // will commit it even if something suspended.
      stopFinishedWorkLoopTimer();
      root.finishedWork = (root.current.alternate: any);
      root.finishedExpirationTime = expirationTime;

      // 这里完成了render阶段，开始commit阶段
      finishSyncRender(root);
    }

    // Before exiting, make sure there's a callback scheduled for the next
    // pending level.
    ensureRootIsScheduled(root);
  }

  return null;
}
```

## `prepareFreshStack`

该函数是为更新做准备工作，其中`workInProgress、workInProgressRoot、renderExpirationTime`等都是全局变量，将当前需要更新的`fiber`树的关键属性挂载在这几个全局变量上，就能通过这几个全局变量知道主线程当前是否有更在更新的任务。

```javascript
// 准备新的堆栈
function prepareFreshStack(root, expirationTime) {
  root.finishedWork = null;
  root.finishedExpirationTime = NoWork;

  const timeoutHandle = root.timeoutHandle;
  if (timeoutHandle !== noTimeout) {
    // The root previous suspended and scheduled a timeout to commit a fallback
    // state. Now that we have additional work, cancel the timeout.
    root.timeoutHandle = noTimeout;
    // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
    cancelTimeout(timeoutHandle);
  }

  // 循环清除当前任务的堆栈，pop掉之前保存的context等
  if (workInProgress !== null) {
    let interruptedWork = workInProgress.return;
    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }

  // 准备一个新的堆栈
  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null);
  renderExpirationTime = expirationTime;
  workInProgressRootExitStatus = RootIncomplete;
  workInProgressRootFatalError = null;
  workInProgressRootLatestProcessedExpirationTime = Sync;
  workInProgressRootLatestSuspenseTimeout = Sync;
  workInProgressRootCanSuspendUsingConfig = null;
  workInProgressRootNextUnprocessedUpdateTime = NoWork;
  workInProgressRootHasPendingPing = false;

  if (enableSchedulerTracing) {
    spawnedWorkDuringRender = null;
  }

  if (__DEV__) {
    ReactStrictModeWarnings.discardPendingWarnings();
  }
}
```

## `workLoopSync`

该函数会循环调用`performUnitOfWork`，而`performUnitOfWork`会返回下一个需要处理的`fiber`，所以这里的逻辑就是只要还有`fiber`需要处理就循环处理，知道所有的`fiber`都处理完毕。

该函数与`workLoopConcurrent`的区别是它不会中断，既然是同步更新，那就不要停止，一直更新完毕。

```javascript
/**
 * 同步循环调用performUnitOfWork
 */
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

## `finishSyncRender`

该函数是在`render`阶段结束后调用，标志着马上就要进入`commit`阶段了。

```javascript
function finishSyncRender(root) {
  // Set this to null to indicate there's no in-progress render.
  workInProgressRoot = null;
  commitRoot(root);
}
```
