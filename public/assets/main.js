!function(e){var s={};function t(i){if(s[i])return s[i].exports;var n=s[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,t),n.l=!0,n.exports}t.m=e,t.c=s,t.d=function(e,s,i){t.o(e,s)||Object.defineProperty(e,s,{enumerable:!0,get:i})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,s){if(1&s&&(e=t(e)),8&s)return e;if(4&s&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(t.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&s&&"string"!=typeof e)for(var n in e)t.d(i,n,function(s){return e[s]}.bind(null,n));return i},t.n=function(e){var s=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(s,"a",s),s},t.o=function(e,s){return Object.prototype.hasOwnProperty.call(e,s)},t.p="/",t(t.s=0)}([function(e,s,t){"use strict";$(document).ready((function(){var e=void 0,s=void 0,t=io("/tech"),i=localStorage.getItem("token");t.emit("tokenCheck",{currentToken:i}),t.on("token_result",(function(e){if(e){var s=localStorage.getItem("token");t.emit("userisonline",s)}else window.location.pathname="/"})),t.on("users",(function(e,s){$(".online-users").prepend(s);for(var t=0;t<e.length;++t)$(".users").append('<div class="user"><div class="user-name"><div class="status '+e[t].status+'"></div><p>'+e[t].user_name+'</p></div><div class="cur-room">Chilled piece</div></div>')})),t.on("current_user",(function(e){$(".sub-title").html(e),s=e.toString()})),$(".room").on("click",(function(){$(".room").removeClass("selected"),$(this).addClass("selected");var s=$(".sub-title").text(),i=$(this).find(".room-name").text();t.emit("join",{room:i,user:s}),e=i,$(".sidebar").is(":visible")?$(".page-back").show():$(".page-back").attr("href","/chatrooms")})),t.on("display_chats",(function(e){$(".chats").find(".message-block").remove();for(var t=0;t<e.length;++t){var i=new Date(Date.parse(e[t].date_time)),n=i.getHours(),o=i.getMinutes();if(o<10&&(o="0"+o),s==e[t].user_name)var a='<div class="message-block this-user"><div class="message-info"><div class="message-username">'+e[t].user_name+'</div><div class="message-said">said @ </div><div class="message-time">'+n+":"+o+'</div></div><div class="message">'+e[t].chat_text+"</div></div>";else a='<div class="message-block"><div class="message-info"><div class="message-username">'+e[t].user_name+'</div><div class="message-said">said @ </div><div class="message-time">'+n+":"+o+'</div></div><div class="message">'+e[t].chat_text+"</div></div>";$(".chats").prepend(a)}})),$(".sendmessage").submit((function(){var i=$(".msg").val();return""==i?($(".msg").val(""),$(".msg").attr("placeholder","Input can't be blank"),!1):(t.emit("message",{msg:i,room:e,user:s}),$(".msg").val(""),!1)})),t.on("message",(function(e){var t=new Date,i=t.getHours(),n=t.getMinutes();e.user==s?$(".chats").prepend('<div class="message-block this-user"><div class="message-info"><div class="message-username">'+e.user+'</div><div class="message-said">said @</div><div class="message-time">'+i+":"+n+'</div></div><div class="message">'+e.msg+"</div></div>"):$(".chats").prepend('<div class="message-block"><div class="message-info"><div class="message-username">'+e.user+'</div><div class="message-said">said @</div><div class="message-time">'+i+":"+n+'</div></div><div class="message">'+e.msg+"</div></div>")})),$(".logout").click((function(e){e.preventDefault();var s=localStorage.getItem("token");t.emit("deleteuser",s)})),t.on("userlogout",(function(e){e?(localStorage.removeItem("token"),location.reload()):console.log("failed to logout")})),t.on("useraway",(function(e){$(".user-name").each((function(){$(this).find("p").text()==s&&$(this).find(".status").removeClass("online").addClass("away")}))})),t.on("useronline",(function(e){$(".user-name").each((function(){$(this).find("p").text()==s&&$(this).find(".status").removeClass("away").addClass("online")}))}));var n=null,o=0;$(document).bind("mousemove keypress",(function(){o++;var e=localStorage.getItem("token");null!==n&&(1==o&&t.emit("userisonline",e),clearTimeout(n)),n=setTimeout((function(){o=0,t.emit("userisaway",e)}),9e4)})),$(window).bind("beforeunload",(function(){var e=localStorage.getItem("token");t.emit("userisoffline",e)})),"chatrooms"==current_page&&($(window).resize((function(){$(window).width()<750?$(".page-back").show():$(".page-back").hide()})),$(window).width()<750?$(".page-back").show():$(".page-back").hide()),"users"==current_page?($(".page-back").hide(),$(".bttn-users").addClass("selected")):"chatrooms"==current_page?$(".bttn-chatroom").addClass("selected"):console.log("error with buttons"),$(window).width()<750&&$(".input-footer").hide();var a=0;$(".room").click((function(){2==++a&&(a=1),$(".content-inner").show(),$(".input-footer").show(),$(window).width()>750||($(".bttns-footer").hide(),$("#sidebar").hide(),$(".content-inner").show())})),$(window).resize((function(){$(window).width()>750?($("#sidebar").show(),$(".sidebar-rooms").show()):(1==a&&($("#sidebar").hide(),$(".bttns-footer").hide(),$(".content-inner").show()),$(".inner-content").is(":visible")&&$("#sidebar").hide())}));var r=$("nav");$(window).resize((function(){$(window).width()>750&&(r.is(":visible")||r.show())})),$(".dropdown").click((function(e){r.toggle(),$(this).find(".fa-bars").toggle(),$(this).find(".fa-times").toggle(),$(".content, footer").click((function(){r.hide()}))}))}))}]);