(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["workspace"],{"20b0":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.workspace?a("section",[a("div",[a("div",{staticClass:"hero is-primary"},[a("div",{staticClass:"hero-body"},[a("router-link",{staticClass:"title",attrs:{to:{name:"Items"}}},[t._v(" "+t._s(t.workspace.name)+" ")])],1),a("div",{staticClass:"hero-foot"},[a("nav",{staticClass:"tabs is-boxed"},[a("div",{staticClass:"container"},[a("ul",[a("li",{class:["Items"==t.$route.name?"is-active":null]},[a("router-link",{attrs:{to:{name:"Items"}}},[t._v(" Items ")])],1),a("li",{class:["Connections"==t.$route.name?"is-active":null]},[a("router-link",{attrs:{to:{name:"Connections"}}},[t._v(" Connections ")])],1),a("li",{class:["Graph"==t.$route.name?"is-active":null]},[a("router-link",{attrs:{to:{name:"Graph"}}},[t._v(" Graph ")])],1),t.isAuthenticated?a("li",{class:["CreateItem"==t.$route.name?"is-active":null]},[a("router-link",{attrs:{to:{name:"CreateItem"}}},[t._v(" New Item ")])],1):t._e(),t.isAuthenticated?a("li",{class:["CreateConnection"==t.$route.name?"is-active":null]},[a("router-link",{attrs:{to:{name:"CreateConnection"}}},[t._v(" Connect ")])],1):t._e(),t.isAuthenticated?a("li",{class:["WorkspaceSettings"==t.$route.name?"is-active":null]},[a("router-link",{attrs:{to:{name:"WorkspaceSettings"}}},[t._v(" Settings ")])],1):t._e()])])])])]),a("div",[a("router-view",{staticClass:"vertical-pad"})],1)])]):t._e()},n=[],s=(a("a9e3"),a("750b")),o=a("0613"),i=Object(s["c"])({name:"Workspace",props:{id:{type:Number,required:!0}},setup:function(){var t=Object(s["a"])(o["b"].getters.workspace),e=Object(s["a"])(o["a"].getters.isAuthenticated);return{workspace:t,isAuthenticated:e}},beforeRouteEnter:function(t,e,a){return t.params.workspaceId!=e.params.workspaceId&&o["b"].mutations.loadWorkspace(parseInt(t.params.workspaceId)).catch((function(t){403===t.statusCode&&a({name:"Forbidden"})})),a()},beforeRouteUpdate:function(t,e,a){return t.meta.workspaceId!=e.meta.workspaceId&&o["b"].mutations.loadWorkspace(parseInt(t.meta.workspaceId)).catch((function(t){403===t.statusCode&&a({name:"Forbidden"})})),a()}}),c=i,u=a("2877"),l=Object(u["a"])(c,r,n,!1,null,null,null);e["default"]=l.exports},7156:function(t,e,a){var r=a("861d"),n=a("d2bb");t.exports=function(t,e,a){var s,o;return n&&"function"==typeof(s=e.constructor)&&s!==a&&r(o=s.prototype)&&o!==a.prototype&&n(t,o),t}},a9e3:function(t,e,a){"use strict";var r=a("83ab"),n=a("da84"),s=a("94ca"),o=a("6eeb"),i=a("5135"),c=a("c6b6"),u=a("7156"),l=a("c04e"),p=a("d039"),d=a("7c73"),f=a("241c").f,m=a("06cf").f,I=a("9bf2").f,v=a("58a8").trim,b="Number",k=n[b],h=k.prototype,C=c(d(h))==b,_=function(t){var e,a,r,n,s,o,i,c,u=l(t,!1);if("string"==typeof u&&u.length>2)if(u=v(u),e=u.charCodeAt(0),43===e||45===e){if(a=u.charCodeAt(2),88===a||120===a)return NaN}else if(48===e){switch(u.charCodeAt(1)){case 66:case 98:r=2,n=49;break;case 79:case 111:r=8,n=55;break;default:return+u}for(s=u.slice(2),o=s.length,i=0;i<o;i++)if(c=s.charCodeAt(i),c<48||c>n)return NaN;return parseInt(s,r)}return+u};if(s(b,!k(" 0o1")||!k("0b1")||k("+0x1"))){for(var w,N=function(t){var e=arguments.length<1?0:t,a=this;return a instanceof N&&(C?p((function(){h.valueOf.call(a)})):c(a)!=b)?u(new k(_(e)),a,N):_(e)},A=r?f(k):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),E=0;A.length>E;E++)i(k,w=A[E])&&!i(N,w)&&I(N,w,m(k,w));N.prototype=h,h.constructor=N,o(n,b,N)}}}]);
//# sourceMappingURL=workspace.3a5fa4e8.js.map