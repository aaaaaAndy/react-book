"use strict";(self.webpackChunkreact_book=self.webpackChunkreact_book||[]).push([[9593],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>C});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},p=Object.keys(e);for(o=0;o<p.length;o++)n=p[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(o=0;o<p.length;o++)n=p[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=o.createContext({}),l=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},m=function(e){var t=l(e.components);return o.createElement(c.Provider,{value:t},e.children)},u="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,p=e.originalType,c=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),u=l(n),d=r,C=u["".concat(c,".").concat(d)]||u[d]||s[d]||p;return n?o.createElement(C,a(a({ref:t},m),{},{components:n})):o.createElement(C,a({ref:t},m))}));function C(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var p=n.length,a=new Array(p);a[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i[u]="string"==typeof e?e:r,a[1]=i;for(var l=2;l<p;l++)a[l]=n[l];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},128:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>s,frontMatter:()=>p,metadata:()=>i,toc:()=>l});var o=n(7462),r=(n(7294),n(3905));const p={sidebar_position:3,tags:["Component","PureComponent","\u7ee7\u627f"]},a=void 0,i={unversionedId:"v16/react/Component-PureComponent",id:"v16/react/Component-PureComponent",title:"Component-PureComponent",description:"Component\u4e0ePureComponent\u662f\u7ecf\u5e38\u4f7f\u7528\u7684\u4e24\u4e2aAPI, \u5b83\u4eec\u7684\u6e90\u7801\u4f4d\u4e8ereact/src/ReactBaseClasses.js\u6587\u4ef6\u4e2d, \u6839\u636e\u6587\u4ef6\u6700\u540e\u4e00\u884c\u53ef\u4ee5\u77e5\u9053, \u8fd9\u4e2a\u6587\u4ef6\u53ea\u5bfc\u51fa\u4e86Component\u548cPureComponent.",source:"@site/docs/v16/react/Component-PureComponent.md",sourceDirName:"v16/react",slug:"/v16/react/Component-PureComponent",permalink:"/react-book/docs/v16/react/Component-PureComponent",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/v16/react/Component-PureComponent.md",tags:[{label:"Component",permalink:"/react-book/docs/tags/component"},{label:"PureComponent",permalink:"/react-book/docs/tags/pure-component"},{label:"\u7ee7\u627f",permalink:"/react-book/docs/tags/\u7ee7\u627f"}],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,tags:["Component","PureComponent","\u7ee7\u627f"]},sidebar:"v16Sidebar",previous:{title:"React.Children",permalink:"/react-book/docs/v16/react/React.Children"},next:{title:"react-dom",permalink:"/react-book/docs/v16/react-dom/"}},c={},l=[{value:"Component",id:"component",level:2},{value:"PureComponent",id:"purecomponent",level:2},{value:"\u63a2\u7a76\u7ee7\u627f\u65b9\u6848",id:"\u63a2\u7a76\u7ee7\u627f\u65b9\u6848",level:2},{value:"\u539f\u578b\u5f0f\u7ee7\u627f",id:"\u539f\u578b\u5f0f\u7ee7\u627f",level:3},{value:"\u5bc4\u751f\u7ec4\u5408\u5f0f\u7ee7\u627f",id:"\u5bc4\u751f\u7ec4\u5408\u5f0f\u7ee7\u627f",level:3}],m={toc:l},u="wrapper";function s(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,o.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Component"),"\u4e0e",(0,r.kt)("inlineCode",{parentName:"p"},"PureComponent"),"\u662f\u7ecf\u5e38\u4f7f\u7528\u7684\u4e24\u4e2aAPI, \u5b83\u4eec\u7684\u6e90\u7801\u4f4d\u4e8e",(0,r.kt)("inlineCode",{parentName:"p"},"react/src/ReactBaseClasses.js"),"\u6587\u4ef6\u4e2d, \u6839\u636e\u6587\u4ef6\u6700\u540e\u4e00\u884c\u53ef\u4ee5\u77e5\u9053, \u8fd9\u4e2a\u6587\u4ef6\u53ea\u5bfc\u51fa\u4e86",(0,r.kt)("inlineCode",{parentName:"p"},"Component"),"\u548c",(0,r.kt)("inlineCode",{parentName:"p"},"PureComponent"),"."),(0,r.kt)("p",null,"\u6587\u4ef6\u672b\u5c3e\u5bfc\u51fa\u4ee3\u7801\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"// \u53ea\u5bfc\u51fa\u4e86\u8fd9\u4e24\u4e2a\u7c7b\nexport { Component, PureComponent };\n")),(0,r.kt)("h2",{id:"component"},"Component"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Component"),"\u7684\u5185\u90e8\u5b9e\u73b0\u5c31\u662f\u4e00\u4e2a\u6784\u9020\u51fd\u6570, \u5b9e\u4f8b\u5c5e\u6027\u6709",(0,r.kt)("inlineCode",{parentName:"p"},"context"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"updater"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"refs"),"\u3001",(0,r.kt)("inlineCode",{parentName:"p"},"props"),"\uff0c\u53ef\u7b80\u8bb0\u4e3a",(0,r.kt)("inlineCode",{parentName:"p"},"curp"),"\u3002 \u540c\u65f6\u5728\u5176\u539f\u578b\u4e0a\u6302\u8f7d\u4e86",(0,r.kt)("inlineCode",{parentName:"p"},"isReactComponent"),"\u5bf9\u8c61\u3001",(0,r.kt)("inlineCode",{parentName:"p"},"setState()"),"\u65b9\u6cd5\u548c",(0,r.kt)("inlineCode",{parentName:"p"},"forceUpdate()"),"\u65b9\u6cd5."),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Component"),"\u6e90\u7801\u5982\u4e0b\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"// \u6302\u8f7d\u4e86curp\u5c5e\u6027\nfunction Component(props, context, updater) {\n  this.props = props;\n  this.context = context;\n  // If a component has string refs, we will assign a different object later.\n  this.refs = emptyObject;\n  // We initialize the default updater but the real one gets injected by the\n  // renderer.\n  this.updater = updater || ReactNoopUpdateQueue;\n}\n\nComponent.prototype.isReactComponent = {};\n\n// \u5e38\u7528\u7684this.setState()\u65b9\u6cd5\nComponent.prototype.setState = function(partialState, callback) {\n  this.updater.enqueueSetState(this, partialState, callback, 'setState');\n}\n\n// \u4e0d\u5e38\u7528\u7684this.forceUpdate()\u65b9\u6cd5\nComponent.prototype.forceUpdate = function(callback) {\n  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');\n};\n")),(0,r.kt)("p",null,"\u7531\u6e90\u7801\u53ef\u4ee5\u770b\u51fa\uff0c\u5f53\u8c03\u7528",(0,r.kt)("inlineCode",{parentName:"p"},"setState"),"\u65f6\u4f1a\u8c03\u7528",(0,r.kt)("inlineCode",{parentName:"p"},"enqueueSetState"),"\uff0c\u4ece\u800c\u8c03\u8d77\u65b0\u4e00\u8f6e\u7684\u8ba1\u7b97\u6e32\u67d3\uff0c\u800c\u8c03\u7528",(0,r.kt)("inlineCode",{parentName:"p"},"forceUpdate"),"\u65f6\uff0c\u8c03\u8d77\u7684\u662f",(0,r.kt)("inlineCode",{parentName:"p"},"enqueueForceUpdate"),"\u65b9\u6cd5\uff0c\u4e5f\u4e0d\u7528\u4f20\u5165\u65b0\u7684",(0,r.kt)("inlineCode",{parentName:"p"},"state"),"\u53c2\u6570\uff0c\u76f4\u63a5\u5f3a\u5236\u5f00\u59cb\u65b0\u4e00\u8f6e\u6e32\u67d3\u3002"),(0,r.kt)("h2",{id:"purecomponent"},"PureComponent"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"PureComponent"),"\u6784\u9020\u51fd\u6570\u7684\u5b9a\u4e49\u66f4\u7b80\u5355, \u53ea\u5b9a\u4e49\u4e86",(0,r.kt)("inlineCode",{parentName:"p"},"curp"),"\u5b9e\u4f8b\u5c5e\u6027, \u5b83\u7684\u539f\u578b\u5c5e\u6027\u662f\u901a\u8fc7\u7ee7\u627f",(0,r.kt)("inlineCode",{parentName:"p"},"Component"),"\u6784\u9020\u51fd\u6570\u6765\u5b9e\u73b0."),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"PureComponent"),"\u6e90\u7801\u5982\u4e0b\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"function PureComponent(props, context, updater) {\n  this.props = props;\n  this.context = context;\n  this.refs = emptyObject;\n  this.updater = updater || ReactNoopUpdateQueue;\n}\n")),(0,r.kt)("h2",{id:"\u63a2\u7a76\u7ee7\u627f\u65b9\u6848"},"\u63a2\u7a76\u7ee7\u627f\u65b9\u6848"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"PureComponent"),"\u7684\u7ee7\u627f\u91c7\u7528\u7684\u662f",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("em",{parentName:"strong"},"\u5bc4\u751f\u7ec4\u5408\u5f0f\u7ee7\u627f")),"\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"// \u6b64\u5904`ComponentDummy`\u51fd\u6570\u76f8\u5f53\u4e8e\u4e0b\u9762\u539f\u578b\u5f0f\u7ee7\u627f\u4e2d\u7684`F`\u51fd\u6570\nfunction ComponentDummy() {}\nComponentDummy.prototype = Component.prototype;\n\n// \u8fd9\u91cc\u5c31\u76f8\u5f53\u4e8e\u539f\u578b\u5f0f\u7ee7\u627f\nconst pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());\n\n// \u8fd9\u91cc\u91cd\u65b0\u6307\u5b9a`PureComponent`\u7684\u539f\u578b\u5bf9\u8c61\u7684`constructor`\u5c5e\u6027\npureComponentPrototype.constructor = PureComponent;\n\n// Avoid an extra prototype jump for these methods.\n// \u8fd9\u91cc\u5c06\u7236\u7c7b\u539f\u578b\u94fe\u4e0a\u7684\u65b9\u6cd5\u76f4\u63a5\u590d\u5236\u5230\u5b50\u7c7b\u539f\u578b\u94fe\u4e0a\uff0c\u4e3a\u7684\u662f\u907f\u514d\u4e00\u7ea7\u4e00\u7ea7\u7684\u67e5\u627e\u539f\u578b\u94fe\uff0c\u63d0\u9ad8\u6027\u80fd\nObject.assign(pureComponentPrototype, Component.prototype);\n\n// \u5b9a\u4e49\u5b50\u7c7b\u7684isPureReactComponent\u5c5e\u6027\npureComponentPrototype.isPureReactComponent = true;\n")),(0,r.kt)("h3",{id:"\u539f\u578b\u5f0f\u7ee7\u627f"},"\u539f\u578b\u5f0f\u7ee7\u627f"),(0,r.kt)("p",null,"\u901a\u8fc7\u4e00\u4e2a\u51fd\u6570\u7684\u539f\u578b\u4ee5\u53e6\u4e00\u4e2a\u5bf9\u8c61\u4e3a\u57fa\u7840\u6765\u751f\u6210\u4e24\u4e2a\u76f8\u4f3c\u7684\u5bf9\u8c61, \u4ece\u800c\u7ee7\u627f\u4f20\u5165\u7684",(0,r.kt)("inlineCode",{parentName:"p"},"obj"),"\u7684\u5c5e\u6027\u548c\u65b9\u6cd5."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"function object(obj) {\n  function F() {};\n  F.prototype = obj;\n  return new F();\n}\n")),(0,r.kt)("h3",{id:"\u5bc4\u751f\u7ec4\u5408\u5f0f\u7ee7\u627f"},"\u5bc4\u751f\u7ec4\u5408\u5f0f\u7ee7\u627f"),(0,r.kt)("p",null,"\u6240\u8c13\u5bc4\u751f\u7ec4\u5408\u5f0f\u7ee7\u627f\uff0c\u5373\u901a\u8fc7\u501f\u7528\u6784\u9020\u51fd\u6570\u6765\u7ee7\u627f\u5c5e\u6027\uff0c\u901a\u8fc7\u539f\u578b\u94fe\u7684\u6df7\u6210\u5f62\u5f0f\u6765\u7ee7\u627f\u65b9\u6cd5\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"function inheritPrototype(child, parent) {\n  const childPrototype = object(parent.prototype);\n  childPrototype.constructor = parent;\n  child.prototype = childPrototype;\n}\n")))}s.isMDXComponent=!0}}]);