"use strict";(self.webpackChunkinmobitas_client=self.webpackChunkinmobitas_client||[]).push([[436],{991:function(e,n,t){t(7313);var r=t(7908),i=t(6417);n.Z=function(e){var n=e.icon,t=e.onClick,o=e.color;return(0,i.jsx)(r.Z,{flex:1,display:"flex",justifyContent:"center",alignItems:"center",borderLeft:"1px solid #EDEFF5",onClick:t,height:"100%",width:"100%",children:(0,i.jsx)(n,{color:o})})}},7403:function(e,n,t){var r=t(5861),i=t(4942),o=t(1413),u=t(9439),c=t(7757),s=t.n(c),a=t(7313),l=t(7890),d=t(6352),f=t(2682),h=t(7908),p=t(6267),v=t(5611),g=t(6020),w=t(3202),Z=t(2649),x=t(9502),m=t(5818),j=t(1837),k=t(3819),b=t(3320),C=t(5110),E=t(2497),P=t(8408),S=t(8474),I=t(9873),y=t(991),T=t(5997),H=t(8710),L=t(6417);n.Z=function(e){var n=e.source,t=e.setSource,c=e.labels,M=e.detailRouteStructure,R=e.editRouteStructure,U=e.deleteBaseUrl,W=(0,l.s0)(),z=(0,a.useRef)(null),O=(0,E.Z)(z),X=(0,d.v9)(f.vn),_=(0,a.useState)(null),B=(0,u.Z)(_,2),F=B[0],N=B[1],A=(0,a.useState)(),D=(0,u.Z)(A,2),G=D[0],Y=D[1],$=(0,a.useRef)(null);(0,S.Z)($,(function(){return N(null)}));var q=(0,P.Z)(),J=(0,a.useMemo)((function(){return n.map((function(e){return Object.keys(e).reduce((function(n,t){return(0,o.Z)((0,o.Z)({},n),{},(0,i.Z)({},t,e[t]))}),{})}))}),[n]),K=(0,a.useMemo)((function(){return n.length?Object.keys(n[0]).filter((function(e){return!e.includes("Id")})).map((function(e,n){return{Header:c[n],accessor:e}})):[]}),[n]),Q=(0,C.useTable)({columns:K,data:J,initialState:{pageIndex:0}},C.usePagination),V=Q.getTableProps,ee=Q.headerGroups,ne=Q.prepareRow,te=Q.page,re=Q.pageCount,ie=Q.state,oe=Q.setPageSize,ue=Q.previousPage,ce=Q.nextPage,se=Q.gotoPage,ae=function(){var e=(0,r.Z)(s().mark((function e(r,i,o){var u,c;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,T.Z.delete("".concat(U,"/").concat(r,"/").concat(i));case 2:u=e.sent,c=n.filter((function(e){return e[o]!==u.data})),t(c),N(null);case 6:case"end":return e.stop()}}),e)})));return function(n,t,r){return e.apply(this,arguments)}}();(0,a.useEffect)((function(){if(O){var e=(0,H.b)(O,64);e>0&&oe(e)}}),[O]);return(0,L.jsxs)(h.Z,{children:[(0,L.jsxs)(p.Z,(0,o.Z)((0,o.Z)({flex:1},V()),{},{children:[(0,L.jsxs)(v.Z,{display:"flex",userSelect:"none",children:[ee.map((function(e){return e.headers.map((function(e,n){return(0,L.jsx)(g.Z,(0,o.Z)((0,o.Z)({flex:.45},e.getHeaderProps()),{},{children:e.render("Header")}))}))})),(0,L.jsx)(g.Z,{flex:.3})]}),(0,L.jsx)(w.Z,{ref:z,height:O,children:te.map((function(e,t){var r=Object.keys(e.original).find((function(e){return e.includes("Id")}));return ne(e),(0,L.jsxs)(Z.Z,(0,o.Z)((0,o.Z)({isHighlighted:F===t,color:"#3a3e58",display:"flex",cursor:"pointer",onMouseOver:"desktop"===q?function(){return N(t)}:void 0,onMouseLeave:"desktop"===q?function(){return N(null)}:void 0,onTouchStart:"touchscreen"===q?function(){Y(setTimeout((function(){return N(t)}),500))}:void 0,onTouchEnd:"touchscreen"===q?function(){clearTimeout(G)}:void 0,onTouchMove:"touchscreen"===q?function(){clearTimeout(G)}:void 0,onClick:function(){"touchscreen"===q?F?N(null):W((0,I.UM)(n[t],M)):W((0,I.UM)(te[t],M))}},e.getRowProps()),{},{children:[e.cells.map((function(n,t){return(0,L.jsx)(x.Z,{flex:.45,paddingX:t===e.cells.length-1?0:12,children:(0,L.jsx)(m.Z,{children:n.render("Cell")})},"item-prop-".concat(t))})),(0,L.jsx)(x.Z,{flex:.3,paddingX:0,children:t===F&&(0,L.jsxs)(h.Z,{ref:$,display:"flex",width:"100%",height:"100%",children:[(0,L.jsx)(y.Z,{icon:j.d,onClick:function(e){e.stopPropagation(),W((0,I.UM)(te[t],R))}}),(0,L.jsx)(y.Z,{icon:k.a,color:"danger",onClick:function(n){n.stopPropagation(),ae(X,e.original[r],r)}})]})})]}))}))})]})),(0,L.jsx)(h.Z,{width:"100%",display:"flex",justifyContent:"center",children:(0,L.jsx)(b.Z,{margin:"auto",page:ie.pageIndex+1,totalPages:re,onNextPage:ce,onPreviousPage:ue,onPageChange:function(e){return se(e-1)}})})]})}},8710:function(e,n,t){t.d(n,{b:function(){return r}});var r=function(e,n){return Math.floor(e/n)}},2201:function(e,n,t){t(7313);var r=t(7908),i=t(6228),o=t(8225),u=t(9466),c=t(7202),s=t(6417);n.Z=function(e){var n=e.messageText,t=e.linkText,a=e.url,l=(0,c.Z)(),d=l.windowInnerWidth,f=l.windowInnerHeight;return(0,s.jsx)(r.Z,{position:"absolute",display:"flex",justifyContent:"center",top:f/2,left:0,paddingX:(0,i.Z)(4),width:d,children:(0,s.jsxs)(o.Z,{is:"h1",color:"#474d66",children:[n,t&&a&&(0,s.jsx)(u.rU,{to:a,className:"link blue",children:t})]})})}},8474:function(e,n,t){var r=t(7313);n.Z=function(e,n){(0,r.useEffect)((function(){var t=function(t){var r;console.log("clicked!"),!t.target.isConnected||null!==e&&void 0!==e&&null!==(r=e.current)&&void 0!==r&&r.contains(t.target)||n()};return document.addEventListener("click",t),function(){return document.removeEventListener("click",t)}}),[n,e])}},8408:function(e,n){n.Z=function(){return"ontouchstart"in document.documentElement?"touchscreen":"desktop"}},2497:function(e,n,t){var r=t(9439),i=t(7313);n.Z=function(e,n){var t,o=(0,i.useState)(),u=(0,r.Z)(o,2),c=u[0],s=u[1],a=function(){if(null!==e&&void 0!==e&&e.current){var t,r=0;r=window.innerHeight-(null===(t=e.current)||void 0===t?void 0:t.offsetTop)-1,n&&(r-=n),s(r-70)}};return(0,i.useEffect)((function(){return a(),window.addEventListener("resize",a),function(){return window.removeEventListener("resize",a)}}),[]),(0,i.useEffect)((function(){a()}),[null===(t=e.current)||void 0===t?void 0:t.offsetTop]),c}},7202:function(e,n,t){var r=t(9439),i=t(7313);n.Z=function(){var e=(0,i.useState)({windowInnerWidth:window.innerWidth,windowInnerHeight:window.innerHeight}),n=(0,r.Z)(e,2),t=n[0],o=n[1];return(0,i.useEffect)((function(){return window.addEventListener("resize",(function(){o({windowInnerWidth:window.innerWidth,windowInnerHeight:window.innerHeight})})),function(){window.removeEventListener("resize",(function(){o({windowInnerWidth:window.innerWidth,windowInnerHeight:window.innerHeight})}))}}),[]),t}},5436:function(e,n,t){t.r(n);var r=t(5861),i=t(9439),o=t(7757),u=t.n(o),c=t(7908),s=t(6352),a=t(4511),l=t(7313),d=t(5997),f=t(2682),h=(t(8435),t(7403)),p=t(2201),v=t(6417);n.default=function(){var e=(0,l.useState)([]),n=(0,i.Z)(e,2),t=n[0],o=n[1],g=(0,l.useState)(!1),w=(0,i.Z)(g,2),Z=w[0],x=w[1],m=(0,s.v9)(f.vn),j=(0,a.$)(["client","ui"]).t;return(0,l.useEffect)((function(){(0,r.Z)(u().mark((function e(){var n;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,d.Z.get("/clients/".concat(m));case 3:(n=e.sent).data.length?o(n.data):x(!0),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))()}),[m]),(0,v.jsxs)(c.Z,{overflow:"scroll",borderColor:"black",children:[Z&&(0,v.jsx)(p.Z,{messageText:j("noClients",{ns:"ui"})+", ",linkText:j("startAddingOne",{ns:"ui"}),url:"/newlisting"}),t.length?(0,v.jsx)(h.Z,{source:t,setSource:o,labels:[j("name"),j("phone")],detailRouteStructure:["clientdetail","clientId"],editRouteStructure:["editclient","clientId"],deleteBaseUrl:"/clients"}):""]})}},5997:function(e,n,t){t.d(n,{Y:function(){return c}});var r=t(1881),i=t.n(r),o=t(460),u=t(8121),c={withCredentials:!0,baseURL:"https://inmobitas-api-production.up.railway.app/"},s=i().create(c);s.interceptors.response.use((function(e){return e}),(function(e){return e.response.data.authorizationError&&o.h.dispatch((0,u.P_)()),Promise.reject(e)})),n.Z=s},8435:function(){}}]);