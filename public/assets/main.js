!function(e){var n={};function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(o,i,function(n){return e[n]}.bind(null,i));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/",t(t.s=0)}([function(e,n,t){"use strict";$(document).ready((function(){$(window).width()<750&&$(".input-footer").hide();var e=0;$(".room").click((function(){2==++e&&(e=1),$(".content-inner").show(),$(".input-footer").show(),$(window).width()>750||($(".bttns-footer").hide(),$("#sidebar").hide(),$(".content-inner").show())})),$(window).resize((function(){$(window).width()>750?($("#sidebar").show(),$(".sidebar-rooms").show()):(1==e&&($("#sidebar").hide(),$(".bttns-footer").hide(),$(".content-inner").show()),$(".inner-content").is(":visible")&&$("#sidebar").hide())}));var n=$("nav");$(window).resize((function(){$(window).width()>750&&(n.is(":visible")?console.log("still here fucker"):(n.show(),console.log("lol")))})),$(".dropdown").click((function(e){n.toggle(),$(this).find(".fa-bars").toggle(),$(this).find(".fa-times").toggle(),$(".content, footer").click((function(){n.hide()}))})),$("input").focus((function(){$("footer").hide()})),$("input").blur((function(){$("footer").show()}))}))}]);