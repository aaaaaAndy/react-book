在`react`中，`setState`和`forceUpdate`也能产生更新，进入调度。

## 原型链挂载`setState`、`forceUpdate`

在`react`包中，`setState`、`forceUpdate`挂载在`Component`和`PureComponent`上。

`Component`类源码如下：

```javascript
/**
 * Base class helpers for the updating state of a component.
 * Component四大属性 curp
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

由此可知，平时调用的`this.setState`、`this.forceUpdate`方法都是挂载在`Component`原型链上的方法，其内部都是调用了`this.updater`上对应的方法，只是`enqueueSetState`需要传入一个`partialState`，`enqueueForceUpdate`不需要传入`state`变化。

`PureComponent`继承了`Component`，所以处理逻辑是跟`Component`相同的。

## `enqueueSetState` && `enqueueForceUpdate`

这两种方法的实现与`render`中的`updateContainer`方法类似，大体意思就是创建一个更新，然后放入队列，最后进入调度。

需要注意的是`enqueueSetState`的`update.payload`挂载的是传进来的`partialState`，也就是要更新的`state`，而`enqueueForceUpdate`只是设置了`update.tag`为`ForceUpdate`，标记这是一个强制更新，没有`state`变化。

```javascript
const classComponentUpdater = {
  isMounted,
  enqueueSetState(inst, payload, callback) {
    const fiber = getInstance(inst);
    const currentTime = requestCurrentTimeForUpdate();
    const suspenseConfig = requestCurrentSuspenseConfig();
    const expirationTime = computeExpirationForFiber(
      currentTime,
      fiber,
      suspenseConfig,
    );

    // 创建一个更新
    const update = createUpdate(expirationTime, suspenseConfig);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    // 将更新放入队列
    enqueueUpdate(fiber, update);

    // 进入调度
    scheduleWork(fiber, expirationTime);
  },
  enqueueForceUpdate(inst, callback) {
    const fiber = getInstance(inst);
    const currentTime = requestCurrentTimeForUpdate();
    const suspenseConfig = requestCurrentSuspenseConfig();
    const expirationTime = computeExpirationForFiber(
      currentTime,
      fiber,
      suspenseConfig,
    );

    // 创建一个更新
    const update = createUpdate(expirationTime, suspenseConfig);

    // 这里的tag是ForceUpdate
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    // 将更新放入队列
    enqueueUpdate(fiber, update);

    // 进入调度
    scheduleWork(fiber, expirationTime);
  },
  enqueueReplaceState(inst, payload, callback) {
    const fiber = getInstance(inst);
    const currentTime = requestCurrentTimeForUpdate();
    const suspenseConfig = requestCurrentSuspenseConfig();
    const expirationTime = computeExpirationForFiber(
      currentTime,
      fiber,
      suspenseConfig,
    );

    // 创建一个更新
    const update = createUpdate(expirationTime, suspenseConfig);
    
    // 这里的tag是ReplaceState
    update.tag = ReplaceState;
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    // 将更新放入队列
    enqueueUpdate(fiber, update);

    // 进入调度
    scheduleWork(fiber, expirationTime);
  },
};
```

## `adoptClassInstance`

`Component`的`this.updater`属性一开始并没有初始化`enqueueSetState`等各个方法，是运行时才初始化，真正初始化的方法在`react-reconciler/src/ReactFiberClassComponent.js`文件中。

如下代码所示，`adoptClassInstance`函数才真正实现了`this.updater`属性。

```javascript
/**
 * 挂载classComponentUpdater对象到this.updater属性上
 * @param workInProgress
 * @param instance
 */
function adoptClassInstance(workInProgress: Fiber, instance: any): void {
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance;
  // The instance needs access to the fiber so that it can schedule updates
  setInstance(instance, workInProgress);
}

```
