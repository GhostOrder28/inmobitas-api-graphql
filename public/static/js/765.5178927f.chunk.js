"use strict";(self.webpackChunkinmobitas_client=self.webpackChunkinmobitas_client||[]).push([[765],{6765:function(e,t,n){n.r(t);var s=n(5861),a=n(9439),i=n(7757),c=n.n(i),r=n(7313),l=n(6352),u=n(7890),o=n(7414),d=n(5997),f=n(2682),p=n(6417),g=(0,r.lazy)((function(){return Promise.all([n.e(29),n.e(723),n.e(740)]).then(n.bind(n,2740))})),x=(0,r.lazy)((function(){return Promise.all([n.e(29),n.e(225),n.e(68),n.e(600),n.e(746)]).then(n.bind(n,8746))}));t.default=function(){var e=(0,u.TH)(),t=(0,u.UO)(),n=t.clientid,i=t.listingid,h=(0,r.useState)(),b=(0,a.Z)(h,2),k=b[0],m=b[1],Z=(0,r.useState)(),v=(0,a.Z)(Z,2),j=v[0],w=v[1],S=(0,r.useState)(null),P=(0,a.Z)(S,2),C=(P[0],P[1]),L=(0,l.v9)(f.vn);switch((0,r.useEffect)((function(){(0,s.Z)(c().mark((function t(){var s,a,r,l;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,"/newlisting"===e.pathname){t.next=18;break}if(!e.pathname.includes("/listingdetail")){t.next=8;break}return t.next=5,d.Z.get("/listings/".concat(L,"/").concat(n,"/").concat(i,"/group"));case 5:s=t.sent,t.next=11;break;case 8:return t.next=10,d.Z.get("/listings/".concat(L,"/").concat(n,"/").concat(i));case 10:s=t.sent;case 11:return t.next=13,d.Z.get("/listingpresets");case 13:a=t.sent,m(s.data),w(a.data),t.next=22;break;case 18:return t.next=20,d.Z.get("/listingpresets");case 20:r=t.sent,w(r.data);case 22:t.next=27;break;case 24:t.prev=24,t.t0=t.catch(0),C(null===(l=t.t0.response)||void 0===l?void 0:l.data.error);case 27:case"end":return t.stop()}}),t,null,[[0,24]])})))()}),[]),e.pathname){case"/newlisting":return(0,p.jsx)(r.Suspense,{fallback:(0,p.jsx)(o.Z,{}),children:(0,p.jsx)(g,{dataPresets:j,setListing:m})});case"/editlisting/".concat(n,"/").concat(i):return(0,p.jsx)(r.Suspense,{fallback:(0,p.jsx)(o.Z,{}),children:(0,p.jsx)(g,{dataPresets:j,listing:k,setListing:m})});case"/listingdetail/".concat(n,"/").concat(i):return(0,p.jsx)(r.Suspense,{fallback:(0,p.jsx)(o.Z,{}),children:(0,p.jsx)(x,{dataPresets:j,listing:k})});default:return(0,p.jsx)(p.Fragment,{children:"no route matched..."})}}},5997:function(e,t,n){n.d(t,{Y:function(){return a}});var s=n(1881),a={withCredentials:!0,baseURL:"https://inmobitas.herokuapp.com/"},i=n.n(s)().create(a);t.Z=i}}]);