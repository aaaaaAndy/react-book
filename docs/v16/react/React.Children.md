---
sidebar_position: 2
tags:
  - Children
  - map
  - forEach
  - count
  - toArray
  - only
---

`React.Children`这个`API`并不常用，但是如果知道并会用这个API的话，还是能提高很大效率的。且不说效率的事情，它们的实现方式也很有趣，值得一探。 

`React.Children`下的API有这些:
```javascript
const Children = {
  map,
  forEach,
  count,
  toArray,
  only,
};
```

## `map`

该方法与数组的`map`方法类似，都是对一个列表的每一项进行操作，然后返回一个新的列表。

![map](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images/20220217112326.png)

`map`源码如下：
```javascript
/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * React.Children.map 方法
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  
  // 初始化一个result数组，用来保存遍历后得到的新child
  const result = [];
  
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  
  // 返回这个result，forEach不用返回
  return result;
}

/**
 * 根据不同条目的 key 遍历 Elements 列表
 *
 * @param {array} children React.children，一个类数组的结构
 * @param {array} array 遍历后的返回值，一个数组结构
 * @param {string} prefix 元素key值，如果递归可根据/划分
 * @param {function} func map方法传入的针对各个元素处理的函数
 * @param {object} context 上下文
 */
function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  let escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }

  // 创建traverseContext对象，用于记录遍历过程中的状态
  const traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context,
  );

  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);

  // 释放traverseContext
  releaseTraverseContext(traverseContext);
}

/**
 * 调用 map 方法传入的 func 方法处理每一个 child
 *
 * @param {object} bookKeeping traverseContext 对象
 * @param {null|string|number|object} child child 对象
 * @param {string} childKey child对应匹配的key
 */
function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  const {result, keyPrefix, func, context} = bookKeeping;

  let mappedChild = func.call(context, child, bookKeeping.count++);

  // 如果经过map的func方法处理后得到的是一个数组，则继续调用mapIntoWithKeyPrefixInternal方法
  // 否则将经过map的func方法处理后得到的对象放入result中
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, c => c);
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix +
        (mappedChild.key && (!child || child.key !== mappedChild.key)
          ? escapeUserProvidedKey(mappedChild.key) + '/'
          : '') +
        childKey,
      );
    }
    result.push(mappedChild);
  }
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * 遍历所有的 children
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

/**
 * 遍历所有的 children，可以理解为是 traverseAllChildren 的具体实现
 * 1. 如果子元素是单节点元素，如string、number、部分object等，则直接调用callback函数处理
 * 2. 如果子元素是多节点元素，如数组、迭代器等，则遍历数组或迭代器，并且递归调用自身
 *
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext
) {
  const type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  // 是否要调用 callback
  let invokeCallback = false;

  // 这里主要是判断是单节点还是多节点
  // 如null, string, number, object等都是单节点情况，可直接调用callback
  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }

  // 单节点情况，直接调用callback
  if (invokeCallback) {
    // 这里就通过调用传入的calback遍历每个节点
    callback(
      traverseContext,
      children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar,
    );

    // 单节点，这里直接return掉了，不会再继续往下走
    return 1;
  }

  let child;
  let nextName;
  let subtreeCount = 0; // Count of children found in the current subtree.
  const nextNamePrefix =
    nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    // 如果是个数组形式，遍历递归调用 traverseAllChildrenImpl
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext,
      );
    }
  } else {
    // 如果是迭代器形式，也进行迭代递归调用 traverseAllChildrenImpl
    const iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      const iterator = iteratorFn.call(children);
      let step;
      let ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext,
        );
      }
    } else if (type === 'object') {
      let addendum = '';
      const childrenString = '' + children;
      // 如果不是 REACT_PORTAL_TYPE, REACT_ELEMENT_TYPE 两种类型的报错，则直接进行报错提示
      invariant(
        false,
        'Objects are not valid as a React child (found: %s).%s',
        childrenString === '[object Object]'
          ? 'object with keys {' + Object.keys(children).join(', ') + '}'
          : childrenString,
        addendum,
      );
    }
  }

  return subtreeCount;
}

```

## `forEach`

`forEach`与`map`类似，都是对`children`进行遍历，只不过`forEach`不用返回一个新数组。

![forEach](https://raw.githubusercontent.com/aaaaaAndy/picture/main/images/20220217114005.png)

`forEach`入口源码如下：

````javascript
/**
 * Iterates through children that are typically specified as `props.children`.
 * 这里与mapIntoWithKeyPrefixInternal函数相思，直接进入遍历递归调用，不用新建一个数组保存新生成的child，也不用返回
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  const traverseContext = getPooledTraverseContext(
    null,
    null,
    forEachFunc,
    forEachContext,
  );
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}
````

## `count`

`count`用来计算children的数量，返回值为数量。

此方法直接调用`traverseAllChildren`，因该方法每次遍历一个child都会返回1，如果递归遍历则会设置变量`subtreeCount`累加总数量。

```javascript
/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children) {
  return traverseAllChildren(children, () => null, null);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext
) {

  // other code ...

  // 单节点情况，直接调用callback
  if (invokeCallback) {
    // 这里就通过调用传入的calback遍历每个节点
    callback(
      traverseContext,
      children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar,
    );

    // 单节点，这里直接return掉了，不会再继续往下走
    return 1;
  }

  let child;
  let nextName;
  // 记录元素的数量
  let subtreeCount = 0; // Count of children found in the current subtree.
  const nextNamePrefix =
    nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    // 如果是个数组形式，遍历递归调用 traverseAllChildrenImpl
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      
      // 这里记录递归节点的数量
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext,
      );
    }
  }

  // 最终返回这个subtreeCount，即遍历的节点数量
  return subtreeCount;
}
```


## `only`

校验传入的`children`是否为一个`REACT_ELEMENT_TYPE`类型的数据，如果是直接返回这个`children`，否则报错。

```javascript
/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  invariant(
    isValidElement(children),
    'React.Children.only expected to receive a single React element child.',
  );
  return children;
}
```

## `toArray`

将`children`转换为数组形式，这里跟`map`方法一样调用`mapIntoWithPrefixInternal`，只是传入的遍历方法是`child => child`，以此来保证只是返回原来的元素，不生成新节点，最终返回`result`数即可。

```javascript
/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */
function toArray(children) {
  const result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, child => child);
  return result;
}
```


## `traverseContextPool`

该对象用来保存`traverseContext`，避免重复创建。

`getPooledTraverseContext`就是从`pool`里面找一个对象，`releaseTraverseContext`会把当前的`context`对象清空然后放回到`pool`中。

```javascript
// 缓存池中可以缓存的`traverseContext`对象的数量
const POOL_SIZE = 10
const traverseContextPool = []

/**
 * 获取一个 traverseContext 对象
 *
 * @param {array} mapResult 用于存放遍历结果的数组
 * @param {string} keyPrefix 循环元素对应key值
 * @param {function} mapFunction 遍历函数
 * @param {object} mapContext 遍历函数的上下文, map函数的第三个参数，一般不传
 * @return {{result, func, context, count: number, keyPrefix}|*}
 */
function getPooledTraverseContext(
  mapResult,
  keyPrefix,
  mapFunction,
  mapContext
) {
  // 如果缓冲池中有对象，直接返回
  // 否则新建一个traverseContext对象
  if (traverseContextPool.length) {
    const traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0,
    };
  }
}

/**
 * 释放 traverseContext 对象
 * @param {object} traverseContext 待释放的 traverseContext 对象
 */
function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}
```

按照这个流程来看，是不是`pool`永远都只有一个值呢，毕竟推出之后操作完了就推入了，这么循环着。答案肯定是否的，这就要讲到`React.Children.map`的一个特性了，那就是对每个节点的`map`返回的如果是数组，那么还会继续展开，这是一个递归的过程。既然涉及到递归那就不会只有一个值了，所以这里用到缓存池的概念就是为了在递归过程中能复用`traverseContext`，不至于每次都新建一个对象。

`mapSingleChildIntoContext`这个方法其实就是调用`React.Children.map(children, callback)`这里的`callback`，就是我们传入的第二个参数，并得到`map`之后的结果。注意重点来了，**如果`map`之后的节点还是一个数组，那么再次进入`mapIntoWithKeyPrefixInternal`，那么这个时候我们就会再次从`pool`里面去`context`了，而`pool`的意义大概也就是在这里了，如果循环嵌套多了，可以减少很多对象创建和`gc`的损耗。**
