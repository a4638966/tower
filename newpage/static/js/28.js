webpackJsonp([28],{"2Lez":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s={data:function(){return{list:[]}},components:{},created:function(){this.getInfo()},mounted:function(){},methods:{getInfo:function(){var t=this;t.Api.newsList({type:0,pageNum:1,pageSize:20}).then(function(e){t.list=e.result.records})},goto:function(t){console.log(window.parent.childfun(t))}}},i={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"page"},[n("div",{staticClass:"new_wrap flot bor4"},[n("ul",{staticClass:"news-content"},t._l(t.list,function(e,s){return n("li",{key:s,on:{click:function(n){return t.goto(e.id)}}},[n("p",{staticClass:"news-info"},[t._v(t._s(e.title))]),t._v(" "),n("p",{staticClass:"news-date"},[t._v(t._s(e.releaseTime))])])}),0)])])},staticRenderFns:[]};var o=n("VU/8")(s,i,!1,function(t){n("VyuA")},"data-v-17cba9be",null);e.default=o.exports},VyuA:function(t,e){}});
//# sourceMappingURL=28.js.map?4f736745e468d967e0c6