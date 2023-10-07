---
sidebar_position: 3
tags:
  - Component
  - PureComponent
  - 继承
---

`Component`与`PureComponent`是经常使用的两个API, 它们的源码位于`react/src/ReactBaseClasses.js`文件中, 根据文件最后一行可以知道, 这个文件只导出了`Component`和`PureComponent`.

文件末尾导出代码：

```javascript
// 只导出了这两个类
export { Component, PureComponent };
```

## Component

`Component`的内部实现就是一个构造函数, 实例属性有`context`, `updater`, `refs`、`props`，可简记为`curp`。 同时在其原型上挂载了`isReactComponent`对象、`setState()`方法和`forceUpdate()`方法.

`Component`源码如下：
```javascript
// 挂载了curp属性
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

// 常用的this.setState()方法
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
}

// 不常用的this.forceUpdate()方法
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

由源码可以看出，当调用`setState`时会调用`enqueueSetState`，从而调起新一轮的计算渲染，而调用`forceUpdate`时，调起的是`enqueueForceUpdate`方法，也不用传入新的`state`参数，直接强制开始新一轮渲染。

## PureComponent

`PureComponent`构造函数的定义更简单, 只定义了`curp`实例属性, 它的原型属性是通过继承`Component`构造函数来实现.

`PureComponent`源码如下：
```javascript
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
```

## 探究继承方案

`PureComponent`的继承采用的是***寄生组合式继承***。

```javascript
// 此处`ComponentDummy`函数相当于下面原型式继承中的`F`函数
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

// 这里就相当于原型式继承
const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());

// 这里重新指定`PureComponent`的原型对象的`constructor`属性
pureComponentPrototype.constructor = PureComponent;

// Avoid an extra prototype jump for these methods.
// 这里将父类原型链上的方法直接复制到子类原型链上，为的是避免一级一级的查找原型链，提高性能
Object.assign(pureComponentPrototype, Component.prototype);

// 定义子类的isPureReactComponent属性
pureComponentPrototype.isPureReactComponent = true;
```

### 原型式继承

通过一个函数的原型以另一个对象为基础来生成两个相似的对象, 从而继承传入的`obj`的属性和方法.

```javascript
function object(obj) {
  function F() {};
  F.prototype = obj;
  return new F();
}
```

### 寄生组合式继承

所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。

```javascript
function inheritPrototype(child, parent) {
  const childPrototype = object(parent.prototype);
  childPrototype.constructor = parent;
  child.prototype = childPrototype;
}
```


