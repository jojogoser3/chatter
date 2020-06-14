$(document).ready(function () {
if ($(window).width() < 750) {
    // for the footer input en buttons (temp)
       $('.input-footer').hide();
}


//selects the current page for the footer and navbar

if(current_page == "users"){
   $('.bttn-users').addClass('selected');
} else if (current_page == "chatrooms"){
   $('.bttn-chatroom').addClass('selected');
} else {
   console.log('page render error')
}

//return button not displayed
if($('.page-back').is(':visible')){
   if(main_page = false){
       
   } else {
       $('.page-back').hide();
   }
}

// link to a chat

var status = 0;

$('.room').click(function(){

   status++;

   if ($(window).width() > 750) {
       
   } else {   

       // for the footer input en buttons (temp)
       $('.input-footer').show();
       $('.bttns-footer').hide();

        $('#sidebar').hide();
       $('.content-inner').show();
   }
})

$(window).resize(function () {
   if ($(window).width() > 750) {
       $('#sidebar').show();
       // for the footer input en buttons (temp)
       

       
           
   } else {
       // for the footer input en buttons (temp)
       if($('.sidebar-rooms').is(":visible")){

       } else {
           $('.bttns-footer').show();
       }
       //$('.input-footer').hide();


       if($('.inner-content').is(":visible")){
               $('#sidebar').hide();
           } else {
      
   } 
   }
})


// dropdown
var i = 0;
var nav = $('nav');

$(window).resize(function () {
   if ($(window).width() > 750) {
       if(nav.is(":visible")) {
           console.log('still here fucker')
       } else {
           nav.show();
           console.log('lol');
       }  
        if($('.chat').is(":visible")) {
            alert(1);
        }
   }
});

$('.dropdown').click(function (e) {
   nav.toggle()
   $(this).find('.fa-bars').toggle();
  $(this).find('.fa-times').toggle();
  $('.content, footer').click(function(){
      nav.hide();
  })
  
})


});