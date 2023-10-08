## setState挂载在fiber上的状态

1. 页面第一次render完时fiber上的状态

   ![Untitled](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202310081547824.png)

2. 调用`setState` → `enqueueSetState` → `enqueueUpdate` 后的`fiber`

   ![Untitled](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202310081548411.png)


## React合成事件、生命周期里的setState是异步的

调用顺序为：`setState` → `enqueueSetState` → `scheduleWork` → `scheduleUpdateOnFiber`

在 `scheduleUpdateOnFiber` 内部先把本次更新的`root`放在同步调度队列里，接下来的 `if` 判断是不相等的，所以不会调用 `flushSyncCallbackQueue` 去马上更新这次状态改变，`executionContext` 不为`0`是因为这次更新是由React的合成事件触发，React此时中处于处理合成事件的状态中。

![Untitled](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202310081548755.png)

## setTimeout、原生DOM事件里的setState是同步

与React合成事件触发逻辑基本相等，只有在判断 `executionContext` 时不同，这里条件判断为 true，会马上调用 `flushSyncCallbackQueue` 刷新同步队列。因为该事件由 `setTimeout` 异步任务触发，触发时React并没有正在调度的任务，`executionContext = 0`，所以会马上更新 `state`

![Untitled](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202310081549244.png)

## React18的setState默认全是异步的

React18中`setState`调用顺序与16是相同的，也是先将更新放到同步任务队列里，差异的地方在于 `flushSyncCallback` 的判断条件，React18对执行同步队列的调用函数判断条件更加苛刻，可以理解为只有在非 `ConcurrentMode` 模式下才有可能调用。

![Untitled](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202310081549495.png)

## React事件派发时 `context` 的改变

可以看到在执行事件派发时， `executionContext` 会发生改变，所以这也就是为什么生命周期和react合成事件中 `setState` 执行时是异步的原因。

![https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309011553882.png](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images202309011553882.png)
