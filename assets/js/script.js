$(document).ready(function () {
	$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
  $('.button-collapse').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'right', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true, // Choose whether you can drag to open on touch screens,
  });
  $('select').material_select();                                                        
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 100, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',        
    closeOnSelect: false // Close upon selecting a date,
  });
	
	if($('.header').length > 0 )
	{
		var navbar = $('.header'),
		navpos = navbar.offset();   //position of element that triggers function
			$(window).bind('scroll', function() {
				if ($(window).scrollTop() > navpos.top) {
				  navbar.addClass('fixed');
			$('.header').css({"box-shadow": "0 1px 3px rgba(0, 0, 0, .3)"});
				} else {
					navbar.removeClass('fixed');
					$('.header').css({"box-shadow": "none"});
				}
			});
	}
	

  // $('time').countDown({
  //     with_separators: false
  // });
  // $('.alt-1').countDown({
  //     css_class: 'countdown-alt-1'
  // });
  // $('.alt-2').countDown({
  //     css_class: 'countdown-alt-2'
  // });

// 	var maxHeight = 0;
//   $(".equalize").each(function(){    //column set to equalize
//   	if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//   });
//   $(".equalize").height(maxHeight);

//   var maxHeight = 0;
//   $(".equalize1").each(function(){    //column set to equalize
//   	if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//   });
//   $(".equalize1").height(maxHeight);

//   var maxHeight = 0;
//   $(".equalize2").each(function(){    //column set to equalize
//   	if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//   });
//   $(".equalize2").height(maxHeight);

//   var maxHeight = 0;
//   $(".equalize3").each(function(){    //column set to equalize
//   	if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//   });
//   $(".equalize3").height(maxHeight);

//   var maxHeight = 0;
//   $(".equalize4").each(function(){    //column set to equalize
//   	if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//   });
//   $(".equalize4").height(maxHeight);

//   var maxHeight = 0;
//   $(".equalize5").each(function(){    //column set to equalize
//   	if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//   });
//   $(".equalize5").height(maxHeight);

//   var maxHeight = 0;
//   $(".equalize6").each(function(){    //column set to equalize
//   	if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//   });
//   $(".equalize6").height(maxHeight);

//   var maxHeight = 0;
//   $(".equalize7").each(function(){    //column set to equalize
//     if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//   });
//   $(".equalize7").height(maxHeight);

//   var maxHeight = 0;
//   $(".equalize8").each(function(){    //column set to equalize
//   	if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
//   });
//   $(".equalize8").height(maxHeight);

	//product quantity selector...
	var count = 1;
   

    $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
    });

      var loginForm = $(".login-form, .reg-text-box"),
		registerForm = $(".login-text-box, .reg-form"),
		forgotForm = $(".forgot-form");
  $("#show-reg-form").click(function(){
  	loginForm.hide();
  	forgotForm.hide();
  	registerForm.show();
  });
  $("#show-login-form").click(function(){
  	registerForm.hide();
  	forgotForm.hide();
  	loginForm.show();
  });
  $("#show-forgot-form").click(function(){
  	loginForm.hide();
  	registerForm.hide();
  	$('.reg-text-box').show();
  	forgotForm.show();
  });
  $('.collapsible').collapsible();
});