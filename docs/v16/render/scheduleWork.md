进入`scheduleWork`就意味着进入了调度阶段。

## `schedulwWork`

`scheduleWork`方法的具体实现在`react-reconciler/src/ReactFiberWorkLoop.js`文件中。

`scheduleUpdateOnFiber`即为`scheduleWork`方法。其主逻辑在函数内的一个`if...else...`条件判断中：

- 如果`expirationTime ==== Sync`，即代表当前`Root`树是同步更新，且当前执行线程不是批量更新，也不处于`render、commit`阶段，则马上调用`performSyncWorkOnRoot`方法进行同步更新；
- 反之，当前任务可能是异步任务，可能主线程正处于批量更新中，可能当前主线程处于`render、commit`阶段，则调用`ensureRootIsScheduled`方法将本地更新放入更新队列中，待线程有空时再触发更新，这就是涉及到`react`的调度更新了；

流程图如下：

![scheduleWork](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images/20220217200847.png)

`scheduleWork`源码如下：

```javascript
export const scheduleWork = scheduleUpdateOnFiber;

/**
 * 开始调度
 * @param {Fiber} fiber 对应的fiber
 * @param {ExpirationTime} expirationTime 过期时间
 */
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  expirationTime: ExpirationTime,
) {
  //检查是否达到了最大更新数50次
  checkForNestedUpdates();

  // 警告提示是否在render阶段调用了一个更新，如setState
  warnAboutRenderPhaseUpdatesInDEV(fiber);

  // 标记从fiber到root的更新时间
  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (root === null) {
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return;
  }

  // 判断是否有高优先级任务打断当前正在执行的任务
  checkForInterruption(fiber, expirationTime);

  // 用来记录调度器的执行状态
  recordScheduleUpdate();

  // TODO: computeExpirationForFiber also reads the priority. Pass the
  // priority as an argument to that function and this one.
  const priorityLevel = getCurrentPriorityLevel();

  if (expirationTime === Sync) {
    if (
      // Check if we're inside unbatchedUpdates
      // 第一次执行render的时候调用unbatchedUpdate()时设置了executionContext |= LegacyUnbatchedContext
      // 调用ReactDOM.render时，当前条件为真
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      // Check if we're not already rendering
      // 判断是否处于render或commit阶段
      // 调用ReactDOM.render时，当前条件为真
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // Register pending interactions on the root to avoid losing traced interaction data.
      // 用来处理交互引起的更新，跟踪这些更新，并计数、检测它们是否会报错
      schedulePendingInteractions(root, expirationTime);

      // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
      // root inside of batchedUpdates should be synchronous, but layout updates
      // should be deferred until the end of the batch.
      // 如果本地更新是同步的，而且当前还未渲染，意味着主线程空闲，并没有react的更新任务在执行，
      // 那么就调用performSyncWorkOnRoot开始工作
      performSyncWorkOnRoot(root);
    } else {
      // 如果是本次更新是同步的，不过当前有React更新任务正在进行，
      // 而且因为无法打断，所以调用ensureRootIsScheduled
      // 目的是去复用已经在更新的任务，让这个已有的任务
      // 把这次更新顺便做了
      ensureRootIsScheduled(root);

      schedulePendingInteractions(root, expirationTime);
      if (executionContext === NoContext) {
        // Flush the synchronous work now, unless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of legacy mode.
        flushSyncCallbackQueue();
      }
    }
  } else {
    // 如果是更新是异步的，调用ensureRootIsScheduled去进入异步调度
    ensureRootIsScheduled(root);
    schedulePendingInteractions(root, expirationTime);
  }

  if (
    (executionContext & DiscreteEventContext) !== NoContext &&
    // Only updates at user-blocking priority or greater are considered
    // discrete, even inside a discrete event.
    (priorityLevel === UserBlockingPriority ||
      priorityLevel === ImmediatePriority)
  ) {
    // This is the result of a discrete event. Track the lowest priority
    // discrete update per root so we can flush them early, if needed.
    if (rootsWithPendingDiscreteUpdates === null) {
      rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
    } else {
      const lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
      if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
      }
    }
  }
}
```
## `checkForNestedUpdates`

源码如下：

```javascript
// 最大更新数
const NESTED_UPDATE_LIMIT = 50;

/**
 * 检查是否处于无限循环更新中
 */
function checkForNestedUpdates() {
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0;
    rootWithNestedUpdates = null;
    invariant(
      false,
      'Maximum update depth exceeded. This can happen when a component ' +
      'repeatedly calls setState inside componentWillUpdate or ' +
      'componentDidUpdate. React limits the number of nested updates to ' +
      'prevent infinite loops.',
    );
  }

  if (__DEV__) {
    if (nestedPassiveUpdateCount > NESTED_PASSIVE_UPDATE_LIMIT) {
      nestedPassiveUpdateCount = 0;
      console.error(
        'Maximum update depth exceeded. This can happen when a component ' +
        'calls setState inside useEffect, but useEffect either doesn\'t ' +
        'have a dependency array, or one of the dependencies changes on ' +
        'every render.',
      );
    }
  }
}
```

其中`nestedUpdateCount`只会在一次更新的`commit`阶段才会加1，因为一次`commit`代表一次更新，所以可以使用这个变量来记录更新次数，这里的逻辑就是当循环更新次数超过50次是就认为进入了无限循环中，当即报错提醒。相信大家在日常开发中也遇见过`invariant`函数中的报错，那就是这里打印的。

## `markUpdateTimeFromFiberToRoot`

此方法是将`fiber`上的过期时间`expirationTime`反应到父级、祖父级`fiber`的`childExpirationTime`上，以便直接找到父级`fiber`的`childExpirationTime`就能知道当前`fiber`的子树是否需要更新。

源码如下：

```javascript
// This is split into a separate function so we can mark a fiber with pending
// work without treating it as a typical update that originates from an event;
// e.g. retrying a Suspense boundary isn't an update, but it does schedule work
// on a fiber.
// 1. 更新fiber的过期时间，如果 fiber 上存在 alternate，同时更新 alternate 的过期时间；
// 2. 根据 fiber.return 向上遍历父节点，直到找到 rootFiber（node === null && fiber.tag === HostRoot）；
// 3. 在遍历的过程中更新父节点的 childExpirationTime，如果父节点上存在 alternate 同时更新 alternate.childExpirationTime；
// 4. 找到 rootFiber 后，根据 rootFiber.stateNode=fiberRoot 的关系，找到 fiberRoot；
// 5. markUnprocessedUpdateTime、markRootSuspendedAtTime 大致上看是用来做中断恢复的处理；
// 6. 调用 markRootUpdatedAtTime 标记 fiberRoot 上有待处理的更新。
function markUpdateTimeFromFiberToRoot(fiber, expirationTime) {
  // Update the source fiber's expiration time
  // 更新源fiber的expirationTime
  if (fiber.expirationTime < expirationTime) {
    fiber.expirationTime = expirationTime;
  }

  // 更新fiber.alternate的expirationTime
  let alternate = fiber.alternate;
  if (alternate !== null && alternate.expirationTime < expirationTime) {
    alternate.expirationTime = expirationTime;
  }

  // Walk the parent path to the root and update the child expiration time.
  // 更新从当前fiber到root的所有父级元素的expirationTime
  let node = fiber.return;
  let root = null;
  // RootFiber对应的tag为HostRoot = 3;
  if (node === null && fiber.tag === HostRoot) {
    // fiber.stateNode为获取RootFiber对应的FiberRoot
    root = fiber.stateNode;
  } else {
    while (node !== null) {
      alternate = node.alternate;
      if (node.childExpirationTime < expirationTime) {
        node.childExpirationTime = expirationTime;
        if (
          alternate !== null &&
          alternate.childExpirationTime < expirationTime
        ) {
          alternate.childExpirationTime = expirationTime;
        }
      } else if (
        alternate !== null &&
        alternate.childExpirationTime < expirationTime
      ) {
        alternate.childExpirationTime = expirationTime;
      }
      if (node.return === null && node.tag === HostRoot) {
        root = node.stateNode;
        break;
      }
      node = node.return;
    }
  }

  if (root !== null) {
    if (workInProgressRoot === root) {
      // 当在render阶段时收到一个render，第一次render不会进入这里
      // Received an update to a tree that's in the middle of rendering. Mark
      // that's unprocessed work on this root.
      // 标记未处理的更新时间
      // 当收到对渲染的中间树的更新，标记这是该根目录上的未处理工作。
      markUnprocessedUpdateTime(expirationTime);

      if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
        // The root already suspended with a delay, which means this render
        // definitely won't finish. Since we have a new update, let's mark it as
        // suspended now, right before marking the incoming update. This has the
        // effect of interrupting the current render and switching to the update.
        // TODO: This happens to work when receiving an update during the render
        // phase, because of the trick inside computeExpirationForFiber to
        // subtract 1 from `renderExpirationTime` to move it into a
        // separate bucket. But we should probably model it with an exception,
        // using the same mechanism we use to force hydration of a subtree.
        // TODO: This does not account for low pri updates that were already
        // scheduled before the root started rendering. Need to track the next
        // pending expiration time (perhaps by backtracking the return path) and
        // then trigger a restart in the `renderDidSuspendDelayIfPossible` path.
        // 当根目录已经被设置为延迟更新，这意味着该渲染一定不会结束。
        // 由于我们有新的更新，因此我们在标记新的 update 之前，将其标记为
        // 现在暂停。这有中断当前渲染并切换到更新的效果。
        markRootSuspendedAtTime(root, renderExpirationTime);
      }
    }
    // Mark that the root has a pending update.
    // 标记fiberRoot上有待处理的更新
    markRootUpdatedAtTime(root, expirationTime);
  }

  return root;
}
```

## `checkForInterruption`

```javascript
// 判断是否有高优先级任务打断当前正在执行的任务
function checkForInterruption(
  fiberThatReceivedUpdate: Fiber,
  updateExpirationTime: ExpirationTime,
) {
  if (
    enableUserTimingAPI &&
    workInProgressRoot !== null &&
    updateExpirationTime > renderExpirationTime
  ) {
    // 如果当前 fiber 的优先级更高，需要打断当前执行的任务，
    // 立即执行该 fiber 上的 update，更新 interruptedBy 全局属性
    interruptedBy = fiberThatReceivedUpdate;
  }
}

```

## `schedulePendingInteractions`

错误跟踪，`__interactionsRef.current`是一个 `Set` 数据结构，能用来识别更新是由什么引起的，尽管这个追踪更新的 `API` 依然是实验性质的。利用 `FiberRoot` 的 `pendingInteractionMap` 属性和不同的`expirationTime`，获取每次 `schedule` 所需的 `update` 任务的集合，记录它们的数量，并检测这些任务是否会出错。

```javascript
function pushInteractions(root) {
  if (enableSchedulerTracing) {
    const prevInteractions: Set<Interaction> | null = __interactionsRef.current;
    __interactionsRef.current = root.memoizedInteractions;
    return prevInteractions;
  }
  return null;
}

function popInteractions(prevInteractions) {
  if (enableSchedulerTracing) {
    __interactionsRef.current = prevInteractions;
  }
}

// 只是 scheduleInteractions 的加壳函数
function schedulePendingInteractions(root, expirationTime) {
  // This is called when work is scheduled on a root.
  // It associates the current interactions with the newly-scheduled expiration.
  // They will be restored when that expiration is later committed.
  if (!enableSchedulerTracing) {
    return;
  }

  // 当工作安排在root时调用。
  // 将当前交互与新计划的过期时间相关联。
  // 它们将在以后到期时恢复。
  scheduleInteractions(root, expirationTime, __interactionsRef.current);
}

// 主要涉及到 scheduler-tracing 交互的处理
function scheduleInteractions(root, expirationTime, interactions) {
  if (!enableSchedulerTracing) {
    return;
  }

  if (interactions.size > 0) {
    const pendingInteractionMap = root.pendingInteractionMap;
    const pendingInteractions = pendingInteractionMap.get(expirationTime);
    if (pendingInteractions != null) {
      interactions.forEach(interaction => {
        if (!pendingInteractions.has(interaction)) {
          // Update the pending async work count for previously unscheduled interaction.
          // 更新以前未计划的交互的待处理异步工作计数
          interaction.__count++;
        }

        pendingInteractions.add(interaction);
      });
    } else {
      pendingInteractionMap.set(expirationTime, new Set(interactions));

      // Update the pending async work count for the current interactions.
      // 更新当前交互的待处理异步工作计数
      interactions.forEach(interaction => {
        interaction.__count++;
      });
    }

    const subscriber = __subscriberRef.current;
    if (subscriber !== null) {
      const threadID = computeThreadID(root, expirationTime);
      subscriber.onWorkScheduled(interactions, threadID);
    }
  }
}

//遍历检测，抛出错误
function onWorkScheduled(
  interactions: Set<Interaction>,
  threadID: number,
): void {
  let didCatchError = false;
  let caughtError = null;

  subscribers.forEach(subscriber => {
    try {
      subscriber.onWorkScheduled(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

```
