---
sidebar_position: 1
tags:
  - React
---

`React`的核心包括`react`库和`react-dom`库,`react`仅仅1000多行代码，而`react-dom`却将近2w行. 其实 `react`库中仅仅是定义了我们的一些基础, 导出一些我们常用的API, 而`react-dom`库则包含了大部分框架逻辑.

这一系列文章是在`React16+`的基础上写的, React16相较于之前的版本是核心上的一次重写，虽然主要的API都没有变化，但是增加了很多能力。并且首次引入了`Fiber`的概念，之后新的功能都是围绕`Fiber`进行实现，比如`AsyncMode`，`Profiler`等

下面是`React`库对外暴露的所有`API`: 

```javascript
// React.Children下挂载了一些可以直接处理props.children的方法
// map、forEach与数组下同名方法的区别是这里的map、forEach至少做了特殊判断，不用担心非空的情况
const Children = {
  map,
  forEach,
  count,
  toArray,
  only,
};

export {
  // 这个对象提供了一堆帮你处理`props.children`的方法，因为`children`是一个类似数组但又不是数组的数据结构
  // 当你真正了解`React.Children`中方法的基础原理后, 你会彻底认识这是一个很方便很强大的API.
  Children,
  
  // 用来创建一个实例的引用
  createRef,
  
  // 类组件需要继承的两个父级组件
  Component,
  PureComponent,
  
  // 创建context
  createContext,
  
  // 用来解决HOC组件传递`ref`的问题的
  forwardRef,
  
  // 懒加载，需要配个Suspense使用
  lazy,
  
  // 缓存组件，props相同时跳过渲染，直接复用最近一次侧渲染结果
  // 一般在进行React性能优化时使用
  memo,
  
  // React 新增的几个hooks
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  
  // 以下四个只是一种类型的占位符，在React包中没有复杂逻辑，只是在调度渲染时遇到它们会做一些特殊处理
  REACT_FRAGMENT_TYPE as Fragment,
  REACT_PROFILER_TYPE as Profiler,
  REACT_STRICT_MODE_TYPE as StrictMode,
  REACT_SUSPENSE_TYPE as Suspense,
  
  // 创建一个元素
  createElement,
  
  // 克隆一个元素
  cloneElement,
  
  // 验证是否是一个ReactElement
  isValidElement,
  
  // 获取React版本
  ReactVersion as version,
  
  // 一些全局共享变量，正如后边英文所说，不要去使用或改动这里，否则你会被炒鱿鱼
  ReactSharedInternals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  
  // 创建专门用来创建某一类ReactElement的工厂
  createFactory,
  
  useTransition,
  useDeferredValue,
  
  REACT_SUSPENSE_LIST_TYPE as SuspenseList,
  withSuspenseConfig as unstable_withSuspenseConfig,
  // enableBlocksAPI
  block,
  // enableDeprecatedFlareAPI
  useResponder as DEPRECATED_useResponder,
  createResponder as DEPRECATED_createResponder,
  // enableFundamentalAPI
  createFundamental as unstable_createFundamental,
  // enableScopeAPI
  createScope as unstable_createScope,
  
  // 与React.createElement类似, 用来创建一个Element对象.
  jsx,
  jsxs,
  jsxDEV,
};
```

