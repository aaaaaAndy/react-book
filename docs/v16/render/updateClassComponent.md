## `beginWork`

该方法用来处理`ClassComponent`的更新，由`beginWork`方法调用，位于`react-reconciler`文件中。

在`beginWork`方法中：
```javascript
function beginWork() {
  // code ...
  switch (workInProgress.tag) {
    // code ...
    case ClassComponent: {
      // 获取组件class，即定义时写的class xxx extends Component类
      const Component = workInProgress.type;

      // 未处理的props，也就是即将要渲染的props
      const unresolvedProps = workInProgress.pendingProps;

      // 处理props，得到最终的props
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);

      // 调用updateClassComponent函数处理classComponent组件
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // code ...
  }
  // code ...
}
```
## `updateClassComponent`

该方法主要流程如下：
1. 当类实例不存在时，调用`constructClassInstance`方法创建类实例，并调用`mountClassInstance`方法处理`mount`阶段的生命周期；
2. 当类实例存在，但是`current`为`null`时，即第一次渲染的情况，调用`resumeMountClassInstance`，只需要执行`mount`阶段的生命周期；
3. 当两者都存在时，也就是进入了更新阶段，调用`updateClassInstance`进行更新操作即可。

以上三种操作都会改变`shouldUpdate`的值，最终会调用`finishClassComponent`进入`fiber`的调度阶段。

```javascript
/**
 * 更新class式组件
 * @param {Fiber} current 更新前fiber
 * @param {Fiber} workInProgress 更新过程中的fiber
 * @param {ClassComponent} Component 组件类
 * @param {object} nextProps 下一阶段的props
 * @param {ExpirationTime} renderExpirationTime 更新时间
 * @return {Fiber}
 */
function updateClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps,
  renderExpirationTime: ExpirationTime,
) {
  // Push context providers early to prevent context stack mismatches.
  // During mounting we don't know the child context yet as the instance doesn't exist.
  // We will invalidate the child context in finishClassComponent() right after rendering.
  // context处理
  let hasContext;
  if (isLegacyContextProvider(Component)) {
    hasContext = true;
    pushLegacyContextProvider(workInProgress);
  } else {
    hasContext = false;
  }
  prepareToReadContext(workInProgress, renderExpirationTime);

  // instance为class类的实例
  const instance = workInProgress.stateNode;
  let shouldUpdate;

  // 这里是判断当前的workInProgress是否已初始化过
  if (instance === null) {
    // 当该class还未实例化时
    if (current !== null) {
      // A class component without an instance only mounts if it suspended
      // inside a non-concurrent tree, in an inconsistent state. We want to
      // treat it like a new mount, even though an empty version of it already
      // committed. Disconnect the alternate pointers.
      // alternate意味着当前更新完成
      current.alternate = null;
      workInProgress.alternate = null;
      // Since this is conceptually a new fiber, schedule a Placement effect
      workInProgress.effectTag |= Placement;
    }

    // In the initial pass we might need to construct the instance.
    // 初始化class实例并挂载到workInProgress.stateNode，获取context，计算state
    constructClassInstance(workInProgress, Component, nextProps);

    // 执行getDerivedStateFromProps
    // 执行getSnapShotBeforeUpdates
    // 执行componentWillMount
    // 执行UNSAFE_componentWillMount
    // 通过上述执行，计算新state
    mountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
    shouldUpdate = true
  } else if (current === null) {
    // In a resume, we'll already have an instance we can reuse.
    // current === null只会出现在第一次渲染的时候，因为会先创建workInProcess，
    // 在渲染结束之后才会把workInProcess拷贝成current，代表着第一次渲染结束。
    // 而后面也会出现根据current === null来判断是否需要调用componentDidMount的代码
		// 当instance存在，current存在,说明上个更新未完成，可以复用
    // 1. 执行mountClassInstance中的生命周期方法
    shouldUpdate = resumeMountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
  } else {
    // 更新操作
    // 1. 当新老prop，新老context变化时，执行componentWillReceiveProps
    // 2. 执行getDerivedStateFromProps
    // 3. 执行shouldComponentUpdate
    // 4. 执行componentWillUpdate
    // 5. 执行UNSAFE_componentWillUpdate
    // 6. 标记componentDidUpdate
    // 7. 标记getSnapShotBeforeUpdate
    shouldUpdate = updateClassInstance(
      current,
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
  }

  // 更新完成
  // 1. 标记ref的更新，即使当前组件不需要更新
  // 2. 如果当前组件不需要更新，且不需要捕获错误，则执行bailoutOnAlreadyFinishedWord
  // 3. 执行instance.render()，获取新children
  // 4. 执行reconcileChildren调和子节点
  // 5. 返回当前节点的child，下一个回合对child进行更新
  const nextUnitOfWork = finishClassComponent(
    current,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderExpirationTime,
  );
  if (__DEV__) {
    let inst = workInProgress.stateNode;
    if (inst.props !== nextProps) {
      if (!didWarnAboutReassigningProps) {
        console.error(
          'It looks like %s is reassigning its own `this.props` while rendering. ' +
            'This is not supported and can lead to confusing bugs.',
          getComponentName(workInProgress.type) || 'a component',
        );
      }
      didWarnAboutReassigningProps = true;
    }
  }
  return nextUnitOfWork;
}
```

## `constructClassInstance`

初始化`ClassComponent`类，主要是使用`new`关键字初始化类，然后给`this.setState，this.forceUpdate`挂载上具体的方法实现。

```javascript
/**
 * 初始化classComponent类
 * @param workInProgress
 * @param ctor
 * @param props
 * @return {*}
 */
function constructClassInstance(
  workInProgress: Fiber,
  ctor: any,
  props: any,
): any {
  let isLegacyContextConsumer = false;
  let unmaskedContext = emptyContextObject;
  let context = emptyContextObject;
  const contextType = ctor.contextType;

  // 获取context
  if (typeof contextType === 'object' && contextType !== null) {
    context = readContext((contextType: any));
  } else if (!disableLegacyContext) {
    unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    const contextTypes = ctor.contextTypes;
    isLegacyContextConsumer =
      contextTypes !== null && contextTypes !== undefined;
    context = isLegacyContextConsumer
      ? getMaskedContext(workInProgress, unmaskedContext)
      : emptyContextObject;
  }

  // 使用new关键字初始化class，这里参数是props和context
  const instance = new ctor(props, context);
  const state = (workInProgress.memoizedState =
    instance.state !== null && instance.state !== undefined
      ? instance.state
      : null);

  // 这里是把classComponentUpdater挂载到this.updater属性上，实现this.setState的具体方法
  adoptClassInstance(workInProgress, instance);

  // Cache unmasked context so we can avoid recreating masked context unless necessary.
  // ReactFiberContext usually updates this cache but can't for newly-created instances.
  if (isLegacyContextConsumer) {
    cacheContext(workInProgress, unmaskedContext, context);
  }

  return instance;
}
```

## `mountClassInstance`

调用`mount`阶段的各个生命周期法方法：
1. 当新生命周期方法`getDerivedStateFromProps`存在时，直接调用；
2. 当新生命周期方法不存在而老生命周期方法（`componentWillMount`,`UNSAFE_componentWillMount`）存在时，才能调用老生命周期函数。

```javascript
// Invokes the mount life-cycles on a previously never rendered instance.
/**
 * 调用mount阶段的生命周期方法
 * @param workInProgress
 * @param ctor
 * @param newProps
 * @param renderExpirationTime
 */
function mountClassInstance(
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderExpirationTime: ExpirationTime,
): void {
  if (__DEV__) {
    checkClassInstance(workInProgress, ctor, newProps);
  }

  const instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;

  // 初始化workInProgress.updateQueue
  initializeUpdateQueue(workInProgress);

  // 获取context
  const contextType = ctor.contextType;
  if (typeof contextType === 'object' && contextType !== null) {
    instance.context = readContext(contextType);
  } else if (disableLegacyContext) {
    instance.context = emptyContextObject;
  } else {
    const unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    instance.context = getMaskedContext(workInProgress, unmaskedContext);
  }

  // 计算updateQueue
  processUpdateQueue(workInProgress, newProps, instance, renderExpirationTime);
  instance.state = workInProgress.memoizedState;

  // 调用getDerivedStateFromProps
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps,
    );
    instance.state = workInProgress.memoizedState;
  }

  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.
  // 新API不存在时才可以调用老的API生命周期函数
  if (
    typeof ctor.getDerivedStateFromProps !== 'function' &&
    typeof instance.getSnapshotBeforeUpdate !== 'function' &&
    (typeof instance.UNSAFE_componentWillMount === 'function' ||
      typeof instance.componentWillMount === 'function')
  ) {
    callComponentWillMount(workInProgress, instance);
    // If we had additional state updates during this life-cycle, let's
    // process them now.
    processUpdateQueue(
      workInProgress,
      newProps,
      instance,
      renderExpirationTime,
    );
    instance.state = workInProgress.memoizedState;
  }

  // 标记commit结束后要执行componentDidMount方法
  if (typeof instance.componentDidMount === 'function') {
    workInProgress.effectTag |= Update;
  }
}
```

## `resumeMountClassInstance`

复用已经初始化的实例，调用`mount`阶段的各个生命周期

## `updateClassInstance`

进入`fiber`的更新阶段
