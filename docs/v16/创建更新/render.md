在日常开发中，`ReactDOm.render()` 是一个很常见的方法。目前的`render`方法是走的`legacy`模式。

## `render`

```javascript
/**
 * 客户端的ReactDOM.render方法, legacy 模式
 * @param {React$Element} element jsx元素
 * @param {DOCUMENT_NODE} container Dom根节点
 * @param {function} callback 回调函数，一般也用不到
 * @return {React$Component<*, *>|PublicInstance}
 */
export function render(
  element: React$Element<any>,
  container: Container,
  callback: ?Function
)  {
  // 这里返回实例，所以ReactDOM.render是有返回值的
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}
```

## `legacyRenderSubtreeIntoContainer`

在该函数内部，会先判断`fiberRoot`是否存在，如果存在，则说明已经渲染过，需要更新，直接调用`updateContainer`更新结课；否则，是第一次渲染，需要先创建`fiberRoot`和对应的`rootFiber`（[详见createFiberRoot](#createFiberRoot)），然后再调用`updateContainer`更新。

如果是第一次渲染的情况，用[unbatchedUpdates](#unbatchedUpdates)包裹了[updateContainer](#updateContainer)函数，为的是不批量更新，能尽快渲染出来。

```javascript
/**
 * legacy模式，渲染子树到传入的container上
 * @param {React$Component} parentComponent
 * @param {ReactNodeList} children 子树
 * @param {DOCUMENT_NODE} container DOM容器，根节点
 * @param {boolean} forceHydrate 是否强制混合
 * @param {function} callback 执行完成后的回调
 * @return {React$Component<*, *>|PublicInstance}
 */
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function
) {

  // member of intersection type." Whyyyyyy.
  let root: RootType = (container._reactRootContainer: any);
  let fiberRoot;
  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    
    // Initial mount should not be batched.
    // 因为是第一次更新，不必批量更新，必须尽快完成
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  
  return getPublicRootInstance(fiberRoot);
}
```

## `createFiberRoot`

`legacyRenderSubtreeIntoContainer`函数中调用的`legacyCreateRootFromDOMContainer`会经过层层调用最终来调用`createFiberRoot`函数，如下：

该函数创建了`root`对应的`FiberRoot`和`FiberRoot`，并最终将两个对象关联起来，即`root.current = uninitializedFiber;uninitializedFiber.stateNode = root;`。

其中 [initializeUpdateQueue](#initializeUpdateQueue) 是为了给新创建的`fiber`初始化`updateQueue`属性。

```javascript
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
	// 第一次render的时候此处FiberRoot的tag为legacyRoot = 0
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  }

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber(tag);
  
  // 将FiberRoot和RootFiber关联起来
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  initializeUpdateQueue(uninitializedFiber);

  return root;
}
```

## `initializeUpdateQueue`

给`fiber`初始化一个`updateQueue`。

```javascript
/**
 * 给fiber初始化一个updateQueue
 * @param {Fiber} fiber 组件的fiber
 */
export function initializeUpdateQueue<State>(fiber: Fiber): void {
  const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState,
    baseQueue: null,
    shared: {
      pending: null,
    },
    effects: null,
  };
  fiber.updateQueue = queue;
}
```


## `unbatchedUpdates`

不批量更新，一般用作第一次初始化时，需要尽快完成更新，所以不能批量更新。

```javascript
/**
 * 不批量更新
 * @param {function} fn 传入的更新函数
 * @param a
 * @return {R}
 */
export function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  const prevExecutionContext = executionContext;

  // 这一步先取非，再位操作并上，意在清除executionContext中已有的BatchedContext位，相当于一个清除作用
  executionContext &= ~BatchedContext;

  // 这一步位操作与上LegacyUnbatchedContext，就是打开executionContext中针对LegacyUnbatchedContext的开关
  executionContext |= LegacyUnbatchedContext;
  try {
    return fn(a);
  } finally {
    // 执行完之后将executionContext恢复成原来的状态
    executionContext = prevExecutionContext;

    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      flushSyncCallbackQueue();
    }
  }
}
```

## `updateContainer`

更新`container`，此函数主要有以下几个步骤：

1. 获取当前时间`currentTime`；
2. 获取过期时间`expirationTime`；
3. 创建一个更新`update`；
4. 将更新放入更新队列中`enqueueUpdate`；
5. 开始调度工作`scheduleWork`.

```javascript
/**
 * 更新container
 * @param {ReactNodeList} element 子树
 * @param {DocumentType} container 子树所挂载DOM节点
 * @param {DocumentType} parentComponent 父节点
 * @param {function} callback 更新完成后执行的回调
 * @return {ExpirationTime}
 */
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  // HostRoot.current = RootFiber
  // RootFiber.stateNode = HostRoot
  const current = container.current;
  const currentTime = requestCurrentTimeForUpdate();

  const suspenseConfig = requestCurrentSuspenseConfig();
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig,
  );

  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  const update = createUpdate(expirationTime, suspenseConfig);
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }

  enqueueUpdate(current, update);
  scheduleWork(current, expirationTime);

  return expirationTime;
}
```
