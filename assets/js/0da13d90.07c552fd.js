"use strict";(self.webpackChunkreact_book=self.webpackChunkreact_book||[]).push([[7881],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>f});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},d=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},m="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),m=l(n),u=o,f=m["".concat(p,".").concat(u)]||m[u]||s[u]||a;return n?r.createElement(f,c(c({ref:t},d),{},{components:n})):r.createElement(f,c({ref:t},d))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,c=new Array(a);c[0]=u;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[m]="string"==typeof e?e:o,c[1]=i;for(var l=2;l<a;l++)c[l]=n[l];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},6647:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>c,default:()=>s,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var r=n(7462),o=(n(7294),n(3905));const a={},c=void 0,i={unversionedId:"v16/\u6e90\u7801\u8c03\u8bd5/ReactDOM.render\u6267\u884c\u8fc7\u7a0b",id:"v16/\u6e90\u7801\u8c03\u8bd5/ReactDOM.render\u6267\u884c\u8fc7\u7a0b",title:"ReactDOM.render\u6267\u884c\u8fc7\u7a0b",description:"DEMO",source:"@site/docs/v16/\u6e90\u7801\u8c03\u8bd5/ReactDOM.render\u6267\u884c\u8fc7\u7a0b.md",sourceDirName:"v16/\u6e90\u7801\u8c03\u8bd5",slug:"/v16/\u6e90\u7801\u8c03\u8bd5/ReactDOM.render\u6267\u884c\u8fc7\u7a0b",permalink:"/react-book/docs/v16/\u6e90\u7801\u8c03\u8bd5/ReactDOM.render\u6267\u884c\u8fc7\u7a0b",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/v16/\u6e90\u7801\u8c03\u8bd5/ReactDOM.render\u6267\u884c\u8fc7\u7a0b.md",tags:[],version:"current",frontMatter:{},sidebar:"v16Sidebar",previous:{title:"\u6e90\u7801\u8c03\u8bd5",permalink:"/react-book/docs/v16/\u6e90\u7801\u8c03\u8bd5/"},next:{title:"setState\u540c\u6b65\u5f02\u6b65\u539f\u7406",permalink:"/react-book/docs/v16/\u6e90\u7801\u8c03\u8bd5/setState\u540c\u6b65\u5f02\u6b65\u539f\u7406"}},p={},l=[{value:"DEMO",id:"demo",level:2},{value:"ReactDOM.render \u5165\u53e3",id:"reactdomrender-\u5165\u53e3",level:2}],d={toc:l},m="wrapper";function s(e){let{components:t,...n}=e;return(0,o.kt)(m,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"demo"},"DEMO"),(0,o.kt)("p",null,"\u4ee5\u4e0b\u9762 App \u8c03\u8bd5\u4e3a\u4f8b"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},"import React, {Component} from 'react';\nimport ReactDOM from 'react-dom';\n\nclass App extends Component {\n  render() {\n    return (\n      <div>\n        <h2>title 2</h2>\n        <p>content p</p>\n      </div>\n    );\n  }\n}\n\nconst renderFinish = () => {\n  console.log(222, 'renderFinish');\n  \n  const container = document.getElementById('root');\n  \n  console.log(333, container, container._reactRootContainer);\n}\n\nReactDOM.render(<App />, document.getElementById('root'), renderFinish);\n")),(0,o.kt)("p",null,"\u4ee5\u8be5 Demo \u6765\u8bf4\uff0c\u5176 fiber \u6811\u5982\u4e0b\u6240\u793a\uff1a"),(0,o.kt)("mermaid",{value:"graph TD\n  A(HostRoot) --\x3e B[App]\n  B --\x3e C[div]\n  C --\x3e D[h2]\n  C --\x3e E[p]  "}),(0,o.kt)("p",null,"\u5728 render \u8fc7\u7a0b\u4e2d\u671f\u5904\u7406\u987a\u5e8f\u5982\u4e0b\uff1a"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"beginWork(HostRoot)")," \u2014> ",(0,o.kt)("inlineCode",{parentName:"p"},"beginWork(App)")," \u2014> ",(0,o.kt)("inlineCode",{parentName:"p"},"beginWork(div)")," \u2014> ",(0,o.kt)("inlineCode",{parentName:"p"},"beginWork(h2)")," \u2014> ",(0,o.kt)("inlineCode",{parentName:"p"},"completeWork(h2)")," \u2014> ",(0,o.kt)("inlineCode",{parentName:"p"},"beginWork(p)")," \u2014> ",(0,o.kt)("inlineCode",{parentName:"p"},"completeWork(p)")," \u2014> ",(0,o.kt)("inlineCode",{parentName:"p"},"completeWork(div)")," \u2014> ",(0,o.kt)("inlineCode",{parentName:"p"},"completeWork(App)")," \u2014> ",(0,o.kt)("inlineCode",{parentName:"p"},"completeWork(HostRoot)")),(0,o.kt)("h2",{id:"reactdomrender-\u5165\u53e3"},"ReactDOM.render \u5165\u53e3"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"// ReactDOM.render \u8c03\u7528\u7684\u65b9\u6cd5\nfunction render(element, container, callback) {\n  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);\n}\n")),(0,o.kt)("p",null,"render\u51fd\u6570\u4e2d\u53c2\u6570 element\uff0c\u4e00\u822c\u4ee3\u8868 React \u7684\u9876\u5c42 DOM\n",(0,o.kt)("img",{parentName:"p",src:"https://raw.githubusercontent.com/aaaaaAndy/picture/main/images/20230904100859.png",alt:"element",title:"element"})))}s.isMDXComponent=!0}}]);