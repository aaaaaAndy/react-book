"use strict";(self.webpackChunkreact_book=self.webpackChunkreact_book||[]).push([[8023],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>b});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=a.createContext({}),p=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=p(e.components);return a.createElement(l.Provider,{value:n},e.children)},d="mdxType",s={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=p(t),m=r,b=d["".concat(l,".").concat(m)]||d[m]||s[m]||o;return t?a.createElement(b,i(i({ref:n},u),{},{components:t})):a.createElement(b,i({ref:n},u))}));function b(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=m;var c={};for(var l in n)hasOwnProperty.call(n,l)&&(c[l]=n[l]);c.originalType=e,c[d]="string"==typeof e?e:r,i[1]=c;for(var p=2;p<o;p++)i[p]=t[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},2493:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>s,frontMatter:()=>o,metadata:()=>c,toc:()=>p});var a=t(7462),r=(t(7294),t(3905));const o={},i=void 0,c={unversionedId:"v16/\u521b\u5efa\u66f4\u65b0/render",id:"v16/\u521b\u5efa\u66f4\u65b0/render",title:"render",description:"\u5728\u65e5\u5e38\u5f00\u53d1\u4e2d\uff0cReactDOm.render() \u662f\u4e00\u4e2a\u5f88\u5e38\u89c1\u7684\u65b9\u6cd5\u3002\u76ee\u524d\u7684render\u65b9\u6cd5\u662f\u8d70\u7684legacy\u6a21\u5f0f\u3002",source:"@site/docs/v16/\u521b\u5efa\u66f4\u65b0/render.md",sourceDirName:"v16/\u521b\u5efa\u66f4\u65b0",slug:"/v16/\u521b\u5efa\u66f4\u65b0/render",permalink:"/react-book/docs/v16/\u521b\u5efa\u66f4\u65b0/render",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/v16/\u521b\u5efa\u66f4\u65b0/render.md",tags:[],version:"current",frontMatter:{},sidebar:"v16Sidebar",previous:{title:"\u521b\u5efa\u66f4\u65b0",permalink:"/react-book/docs/v16/\u521b\u5efa\u66f4\u65b0/"},next:{title:"setState&&forceUpdate",permalink:"/react-book/docs/v16/\u521b\u5efa\u66f4\u65b0/setState&&forceUpdate"}},l={},p=[{value:"<code>render</code>",id:"render",level:2},{value:"<code>legacyRenderSubtreeIntoContainer</code>",id:"legacyrendersubtreeintocontainer",level:2},{value:"<code>createFiberRoot</code>",id:"createfiberroot",level:2},{value:"<code>initializeUpdateQueue</code>",id:"initializeupdatequeue",level:2},{value:"<code>unbatchedUpdates</code>",id:"unbatchedupdates",level:2},{value:"<code>updateContainer</code>",id:"updatecontainer",level:2}],u={toc:p},d="wrapper";function s(e){let{components:n,...t}=e;return(0,r.kt)(d,(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"\u5728\u65e5\u5e38\u5f00\u53d1\u4e2d\uff0c",(0,r.kt)("inlineCode",{parentName:"p"},"ReactDOm.render()")," \u662f\u4e00\u4e2a\u5f88\u5e38\u89c1\u7684\u65b9\u6cd5\u3002\u76ee\u524d\u7684",(0,r.kt)("inlineCode",{parentName:"p"},"render"),"\u65b9\u6cd5\u662f\u8d70\u7684",(0,r.kt)("inlineCode",{parentName:"p"},"legacy"),"\u6a21\u5f0f\u3002"),(0,r.kt)("h2",{id:"render"},(0,r.kt)("inlineCode",{parentName:"h2"},"render")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"/**\n * \u5ba2\u6237\u7aef\u7684ReactDOM.render\u65b9\u6cd5, legacy \u6a21\u5f0f\n * @param {React$Element} element jsx\u5143\u7d20\n * @param {DOCUMENT_NODE} container Dom\u6839\u8282\u70b9\n * @param {function} callback \u56de\u8c03\u51fd\u6570\uff0c\u4e00\u822c\u4e5f\u7528\u4e0d\u5230\n * @return {React$Component<*, *>|PublicInstance}\n */\nexport function render(\n  element: React$Element<any>,\n  container: Container,\n  callback: ?Function\n)  {\n  // \u8fd9\u91cc\u8fd4\u56de\u5b9e\u4f8b\uff0c\u6240\u4ee5ReactDOM.render\u662f\u6709\u8fd4\u56de\u503c\u7684\n  return legacyRenderSubtreeIntoContainer(\n    null,\n    element,\n    container,\n    false,\n    callback,\n  );\n}\n")),(0,r.kt)("h2",{id:"legacyrendersubtreeintocontainer"},(0,r.kt)("inlineCode",{parentName:"h2"},"legacyRenderSubtreeIntoContainer")),(0,r.kt)("p",null,"\u5728\u8be5\u51fd\u6570\u5185\u90e8\uff0c\u4f1a\u5148\u5224\u65ad",(0,r.kt)("inlineCode",{parentName:"p"},"fiberRoot"),"\u662f\u5426\u5b58\u5728\uff0c\u5982\u679c\u5b58\u5728\uff0c\u5219\u8bf4\u660e\u5df2\u7ecf\u6e32\u67d3\u8fc7\uff0c\u9700\u8981\u66f4\u65b0\uff0c\u76f4\u63a5\u8c03\u7528",(0,r.kt)("inlineCode",{parentName:"p"},"updateContainer"),"\u66f4\u65b0\u7ed3\u8bfe\uff1b\u5426\u5219\uff0c\u662f\u7b2c\u4e00\u6b21\u6e32\u67d3\uff0c\u9700\u8981\u5148\u521b\u5efa",(0,r.kt)("inlineCode",{parentName:"p"},"fiberRoot"),"\u548c\u5bf9\u5e94\u7684",(0,r.kt)("inlineCode",{parentName:"p"},"rootFiber"),"\uff08",(0,r.kt)("a",{parentName:"p",href:"#createFiberRoot"},"\u8be6\u89c1createFiberRoot"),"\uff09\uff0c\u7136\u540e\u518d\u8c03\u7528",(0,r.kt)("inlineCode",{parentName:"p"},"updateContainer"),"\u66f4\u65b0\u3002"),(0,r.kt)("p",null,"\u5982\u679c\u662f\u7b2c\u4e00\u6b21\u6e32\u67d3\u7684\u60c5\u51b5\uff0c\u7528",(0,r.kt)("a",{parentName:"p",href:"#unbatchedUpdates"},"unbatchedUpdates"),"\u5305\u88f9\u4e86",(0,r.kt)("a",{parentName:"p",href:"#updateContainer"},"updateContainer"),"\u51fd\u6570\uff0c\u4e3a\u7684\u662f\u4e0d\u6279\u91cf\u66f4\u65b0\uff0c\u80fd\u5c3d\u5feb\u6e32\u67d3\u51fa\u6765\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"/**\n * legacy\u6a21\u5f0f\uff0c\u6e32\u67d3\u5b50\u6811\u5230\u4f20\u5165\u7684container\u4e0a\n * @param {React$Component} parentComponent\n * @param {ReactNodeList} children \u5b50\u6811\n * @param {DOCUMENT_NODE} container DOM\u5bb9\u5668\uff0c\u6839\u8282\u70b9\n * @param {boolean} forceHydrate \u662f\u5426\u5f3a\u5236\u6df7\u5408\n * @param {function} callback \u6267\u884c\u5b8c\u6210\u540e\u7684\u56de\u8c03\n * @return {React$Component<*, *>|PublicInstance}\n */\nfunction legacyRenderSubtreeIntoContainer(\n  parentComponent: ?React$Component<any, any>,\n  children: ReactNodeList,\n  container: Container,\n  forceHydrate: boolean,\n  callback: ?Function\n) {\n\n  // member of intersection type.\" Whyyyyyy.\n  let root: RootType = (container._reactRootContainer: any);\n  let fiberRoot;\n  if (!root) {\n    // Initial mount\n    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(\n      container,\n      forceHydrate,\n    );\n    fiberRoot = root._internalRoot;\n    if (typeof callback === 'function') {\n      const originalCallback = callback;\n      callback = function() {\n        const instance = getPublicRootInstance(fiberRoot);\n        originalCallback.call(instance);\n      };\n    }\n    \n    // Initial mount should not be batched.\n    // \u56e0\u4e3a\u662f\u7b2c\u4e00\u6b21\u66f4\u65b0\uff0c\u4e0d\u5fc5\u6279\u91cf\u66f4\u65b0\uff0c\u5fc5\u987b\u5c3d\u5feb\u5b8c\u6210\n    unbatchedUpdates(() => {\n      updateContainer(children, fiberRoot, parentComponent, callback);\n    });\n  } else {\n    fiberRoot = root._internalRoot;\n    if (typeof callback === 'function') {\n      const originalCallback = callback;\n      callback = function() {\n        const instance = getPublicRootInstance(fiberRoot);\n        originalCallback.call(instance);\n      };\n    }\n    // Update\n    updateContainer(children, fiberRoot, parentComponent, callback);\n  }\n  \n  return getPublicRootInstance(fiberRoot);\n}\n")),(0,r.kt)("h2",{id:"createfiberroot"},(0,r.kt)("inlineCode",{parentName:"h2"},"createFiberRoot")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"legacyRenderSubtreeIntoContainer"),"\u51fd\u6570\u4e2d\u8c03\u7528\u7684",(0,r.kt)("inlineCode",{parentName:"p"},"legacyCreateRootFromDOMContainer"),"\u4f1a\u7ecf\u8fc7\u5c42\u5c42\u8c03\u7528\u6700\u7ec8\u6765\u8c03\u7528",(0,r.kt)("inlineCode",{parentName:"p"},"createFiberRoot"),"\u51fd\u6570\uff0c\u5982\u4e0b\uff1a"),(0,r.kt)("p",null,"\u8be5\u51fd\u6570\u521b\u5efa\u4e86",(0,r.kt)("inlineCode",{parentName:"p"},"root"),"\u5bf9\u5e94\u7684",(0,r.kt)("inlineCode",{parentName:"p"},"FiberRoot"),"\u548c",(0,r.kt)("inlineCode",{parentName:"p"},"FiberRoot"),"\uff0c\u5e76\u6700\u7ec8\u5c06\u4e24\u4e2a\u5bf9\u8c61\u5173\u8054\u8d77\u6765\uff0c\u5373",(0,r.kt)("inlineCode",{parentName:"p"},"root.current = uninitializedFiber;uninitializedFiber.stateNode = root;"),"\u3002"),(0,r.kt)("p",null,"\u5176\u4e2d ",(0,r.kt)("a",{parentName:"p",href:"#initializeUpdateQueue"},"initializeUpdateQueue")," \u662f\u4e3a\u4e86\u7ed9\u65b0\u521b\u5efa\u7684",(0,r.kt)("inlineCode",{parentName:"p"},"fiber"),"\u521d\u59cb\u5316",(0,r.kt)("inlineCode",{parentName:"p"},"updateQueue"),"\u5c5e\u6027\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"export function createFiberRoot(\n  containerInfo: any,\n  tag: RootTag,\n  hydrate: boolean,\n  hydrationCallbacks: null | SuspenseHydrationCallbacks,\n): FiberRoot {\n    // \u7b2c\u4e00\u6b21render\u7684\u65f6\u5019\u6b64\u5904FiberRoot\u7684tag\u4e3alegacyRoot = 0\n  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);\n  if (enableSuspenseCallback) {\n    root.hydrationCallbacks = hydrationCallbacks;\n  }\n\n  // Cyclic construction. This cheats the type system right now because\n  // stateNode is any.\n  const uninitializedFiber = createHostRootFiber(tag);\n  \n  // \u5c06FiberRoot\u548cRootFiber\u5173\u8054\u8d77\u6765\n  root.current = uninitializedFiber;\n  uninitializedFiber.stateNode = root;\n\n  initializeUpdateQueue(uninitializedFiber);\n\n  return root;\n}\n")),(0,r.kt)("h2",{id:"initializeupdatequeue"},(0,r.kt)("inlineCode",{parentName:"h2"},"initializeUpdateQueue")),(0,r.kt)("p",null,"\u7ed9",(0,r.kt)("inlineCode",{parentName:"p"},"fiber"),"\u521d\u59cb\u5316\u4e00\u4e2a",(0,r.kt)("inlineCode",{parentName:"p"},"updateQueue"),"\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"/**\n * \u7ed9fiber\u521d\u59cb\u5316\u4e00\u4e2aupdateQueue\n * @param {Fiber} fiber \u7ec4\u4ef6\u7684fiber\n */\nexport function initializeUpdateQueue<State>(fiber: Fiber): void {\n  const queue: UpdateQueue<State> = {\n    baseState: fiber.memoizedState,\n    baseQueue: null,\n    shared: {\n      pending: null,\n    },\n    effects: null,\n  };\n  fiber.updateQueue = queue;\n}\n")),(0,r.kt)("h2",{id:"unbatchedupdates"},(0,r.kt)("inlineCode",{parentName:"h2"},"unbatchedUpdates")),(0,r.kt)("p",null,"\u4e0d\u6279\u91cf\u66f4\u65b0\uff0c\u4e00\u822c\u7528\u4f5c\u7b2c\u4e00\u6b21\u521d\u59cb\u5316\u65f6\uff0c\u9700\u8981\u5c3d\u5feb\u5b8c\u6210\u66f4\u65b0\uff0c\u6240\u4ee5\u4e0d\u80fd\u6279\u91cf\u66f4\u65b0\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"/**\n * \u4e0d\u6279\u91cf\u66f4\u65b0\n * @param {function} fn \u4f20\u5165\u7684\u66f4\u65b0\u51fd\u6570\n * @param a\n * @return {R}\n */\nexport function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {\n  const prevExecutionContext = executionContext;\n\n  // \u8fd9\u4e00\u6b65\u5148\u53d6\u975e\uff0c\u518d\u4f4d\u64cd\u4f5c\u5e76\u4e0a\uff0c\u610f\u5728\u6e05\u9664executionContext\u4e2d\u5df2\u6709\u7684BatchedContext\u4f4d\uff0c\u76f8\u5f53\u4e8e\u4e00\u4e2a\u6e05\u9664\u4f5c\u7528\n  executionContext &= ~BatchedContext;\n\n  // \u8fd9\u4e00\u6b65\u4f4d\u64cd\u4f5c\u4e0e\u4e0aLegacyUnbatchedContext\uff0c\u5c31\u662f\u6253\u5f00executionContext\u4e2d\u9488\u5bf9LegacyUnbatchedContext\u7684\u5f00\u5173\n  executionContext |= LegacyUnbatchedContext;\n  try {\n    return fn(a);\n  } finally {\n    // \u6267\u884c\u5b8c\u4e4b\u540e\u5c06executionContext\u6062\u590d\u6210\u539f\u6765\u7684\u72b6\u6001\n    executionContext = prevExecutionContext;\n\n    if (executionContext === NoContext) {\n      // Flush the immediate callbacks that were scheduled during this batch\n      flushSyncCallbackQueue();\n    }\n  }\n}\n")),(0,r.kt)("h2",{id:"updatecontainer"},(0,r.kt)("inlineCode",{parentName:"h2"},"updateContainer")),(0,r.kt)("p",null,"\u66f4\u65b0",(0,r.kt)("inlineCode",{parentName:"p"},"container"),"\uff0c\u6b64\u51fd\u6570\u4e3b\u8981\u6709\u4ee5\u4e0b\u51e0\u4e2a\u6b65\u9aa4\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"\u83b7\u53d6\u5f53\u524d\u65f6\u95f4",(0,r.kt)("inlineCode",{parentName:"li"},"currentTime"),"\uff1b"),(0,r.kt)("li",{parentName:"ol"},"\u83b7\u53d6\u8fc7\u671f\u65f6\u95f4",(0,r.kt)("inlineCode",{parentName:"li"},"expirationTime"),"\uff1b"),(0,r.kt)("li",{parentName:"ol"},"\u521b\u5efa\u4e00\u4e2a\u66f4\u65b0",(0,r.kt)("inlineCode",{parentName:"li"},"update"),"\uff1b"),(0,r.kt)("li",{parentName:"ol"},"\u5c06\u66f4\u65b0\u653e\u5165\u66f4\u65b0\u961f\u5217\u4e2d",(0,r.kt)("inlineCode",{parentName:"li"},"enqueueUpdate"),"\uff1b"),(0,r.kt)("li",{parentName:"ol"},"\u5f00\u59cb\u8c03\u5ea6\u5de5\u4f5c",(0,r.kt)("inlineCode",{parentName:"li"},"scheduleWork"),".")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'/**\n * \u66f4\u65b0container\n * @param {ReactNodeList} element \u5b50\u6811\n * @param {DocumentType} container \u5b50\u6811\u6240\u6302\u8f7dDOM\u8282\u70b9\n * @param {DocumentType} parentComponent \u7236\u8282\u70b9\n * @param {function} callback \u66f4\u65b0\u5b8c\u6210\u540e\u6267\u884c\u7684\u56de\u8c03\n * @return {ExpirationTime}\n */\nexport function updateContainer(\n  element: ReactNodeList,\n  container: OpaqueRoot,\n  parentComponent: ?React$Component<any, any>,\n  callback: ?Function,\n): ExpirationTime {\n  // HostRoot.current = RootFiber\n  // RootFiber.stateNode = HostRoot\n  const current = container.current;\n  const currentTime = requestCurrentTimeForUpdate();\n\n  const suspenseConfig = requestCurrentSuspenseConfig();\n  const expirationTime = computeExpirationForFiber(\n    currentTime,\n    current,\n    suspenseConfig,\n  );\n\n  const context = getContextForSubtree(parentComponent);\n  if (container.context === null) {\n    container.context = context;\n  } else {\n    container.pendingContext = context;\n  }\n\n  const update = createUpdate(expirationTime, suspenseConfig);\n  // Caution: React DevTools currently depends on this property\n  // being called "element".\n  update.payload = {element};\n\n  callback = callback === undefined ? null : callback;\n  if (callback !== null) {\n    update.callback = callback;\n  }\n\n  enqueueUpdate(current, update);\n  scheduleWork(current, expirationTime);\n\n  return expirationTime;\n}\n')))}s.isMDXComponent=!0}}]);