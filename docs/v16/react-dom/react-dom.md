---
sidebar_position: 2
tags:
  - ReactDOM
---

## `ReactDOM暴露API`

`react-dom`包导出的`api`如下：

```javascript
export {
  createPortal,
  batchedUpdates as unstable_batchedUpdates,
  flushSync,
  Internals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  ReactVersion as version,
  // Disabled behind disableLegacyReactDOMAPIs
  findDOMNode,
  hydrate,

  // legacy 模式
  render,
  unmountComponentAtNode,

  // exposeConcurrentModeAPIs
  // concurrent 模式
  createRoot,

  // blocking 模式
  createBlockingRoot,
  discreteUpdates as unstable_discreteUpdates,
  flushDiscreteUpdates as unstable_flushDiscreteUpdates,
  flushControlled as unstable_flushControlled,
  scheduleHydration as unstable_scheduleHydration,
  // Disabled behind disableUnstableRenderSubtreeIntoContainer
  renderSubtreeIntoContainer as unstable_renderSubtreeIntoContainer,
  // Disabled behind disableUnstableCreatePortal
  // Temporary alias since we already shipped React 16 RC with it.
  // TODO: remove in React 17.
  unstable_createPortal,
};
```

## 三种模式对比

官网说明：[使用 Concurrent 模式（实验性）](https://zh-hans.reactjs.org/docs/concurrent-mode-adoption.html)

由上源码中可以看出，`react`中存在三种模式，分别是`legacy`、`concurrent`、`blocking`。

- legacy 模式： ReactDOM.render(<App />, rootNode)。这是当前 React app 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持这些新功能。
- blocking 模式： ReactDOM.createBlockingRoot(rootNode).render(<App />)。目前正在实验中。作为迁移到 concurrent 模式的第一个步骤。
- concurrent 模式： ReactDOM.createRoot(rootNode).render(<App />)。目前在实验中，未来稳定之后，打算作为 React 的默认开发模式。这个模式开启了所有的新功能。

可以简单理解，`blocking`模式是`concurrent`模式的一个优雅降级，是`legacy`模式过渡到`concurrent`模式的一个过渡模式。

三种模式特性对比如下：

![特性对比](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images/20220217133733.png)
