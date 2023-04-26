!function(n) {
    "use strict";
    n.fn.idle = function(e) {
        var t, i, o = {
                idle: 6e4,
                events: "mousemove keydown mousedown touchstart",
                onIdle: function() {},
                onActive: function() {},
                onHide: function() {},
                onShow: function() {},
                keepTracking: !0,
                startAtIdle: !1,
                recurIdleCall: !1
            },
            c = e.startAtIdle || !1,
            d = !e.startAtIdle || !0,
            l = n.extend({}, o, e),
            u = null;
        return n(this).on("idle:stop", {}, function() {
            n(this).off(l.events), l.keepTracking = !1, t(u, l)
        }), t = function(n, e) {
            return c && (c = !1, e.onActive.call()), clearTimeout(n), e.keepTracking ? i(e) : void 0
        }, i = function(n) {
            var e, t = n.recurIdleCall ? setInterval : setTimeout;
            return e = t(function() {
                c = !0, n.onIdle.call()
            }, n.idle)
        }, this.each(function() {
            u = i(l), n(this).on(l.events, function() {
                u = t(u, l)
            }), (l.onShow || l.onHide) && n(document).on("visibilitychange webkitvisibilitychange mozvisibilitychange msvisibilitychange", function() {
                document.hidden || document.webkitHidden || document.mozHidden || document.msHidden ? d && (d = !1, l.onHide.call()) : d || (d = !0, l.onShow.call())
            })
        })
    }
}(jQuery);

$(function() {

if(window._YGGConfig.isMobile) {

	let isActive = true;

	$(document).idle({
		onIdle: function(){
			isActive = false;
		},
		onActive: function(){
			isActive = true;
		},
		idle: 1000 * 45
	})

	function setNotifs () { 
		let options = {};
		if(isActive) {
			//$.getJSON(window._YGGConfig.rootURL + 'user/ajax_notifications', function(data) {
			$.getJSON('/user/ajax_notifications', function(data) {
				if(data.new_notifications > 0) {
					list = JSON.parse(data.list);
					new Audio('/assets/sound.mp3').play();
					let l = 7200;
					for (let i = 0; i < list.length; i++) {
						let avatar = undefined; 
						if(list[i].hasOwnProperty('avatar')) {
							avatar = list[i].avatar;
						}
						options.lifeTime = l;
						options.redirect = list[i].target_url;
						$.jnotify(list[i].title, list[i].content, avatar, options);
						l += 2800;
					}
				}	
			});
		}
	}

	setTimeout(function(){
		setNotifs();
		setInterval(setNotifs,1000 * 20);
	}, 1000 * 1);

}

if(window._YGGConfig.isMobile) {
		if(!Cookies.get('hide_side_menu')) {
			hideSidebar();
			$(window).on('resize', function(){
				hideSidebar();
			}); 
		}
	
		function hideSidebar() {
			$(window).width() < 1750 ? $('#cat, .back-cat').removeClass('active') : $('#cat, .back-cat').addClass('active'); 
		}
	}
	
	$('.open').on('click', function(){
		if($('#cat').hasClass('active')){
			Cookies.set('hide_side_menu', true, { expires: 7, domain: '.yggtorrent.do'});
			$('#cat, .back-cat').removeClass('active');
			console.log('hide')
		}else{
			Cookies.remove('hide_side_menu', {domain: '.yggtorrent.do'});
			console.log(Cookies.get('hide_side_menu'))
			$('#cat, .back-cat').addClass('active');
			console.log('no hide')
		}
	});


	window.sendNotif = function(msg,type) {
		$.notify(msg , { type : type ,  allow_dismiss: true , placement: { from: "top", align: "center" },  animate: { enter: 'animated fadeInDown',exit: 'animated fadeOutUp'
	}, delay: 3000, template: '<div data-notify="container" class="col-xs-11 col-sm-5 alert alert-{0}" role="alert">' +
	'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
	'<span data-notify="icon"></span> ' +
	'<span data-notify="title">{1}</span> ' +
	'<span data-notify="message">{2}</span>' +
	'<div class="progress" data-notify="progressbar">' +
		'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
	'</div>' +
	'<a href="{3}" target="{4}" data-notify="url"></a>' +
'</div>' });
	}

$('li').on('click', function () {
	if($(window).width() <= 800){
		$('ul', this).toggle();
	}
});

window.closeNav = function(){
	$('#top').stop().animate({
		'left': -200,
	},150);
	$('[data-nav]').data('nav', 'no').removeClass('ico_close').addClass('ico_navicon');
}
window.navMobile = function(a){
	if(a == 'no'){
		$('#top').stop().animate({
			'left': 0,
		},300);
		$('[data-nav]').data('nav', 'yes').removeClass('ico_navicon').addClass('ico_close');
	}else{
		closeNav();
	}
}       
window.closeUser = function(){
	$('.panel').stop().animate({
		'right': -200,
	},150);
	$('[data-user]').data('nav', 'no').removeClass('ico_close').addClass('ico_user');
}
window.userMobile = function(a){
	if(a == 'no'){
		$('.panel').stop().animate({
			'right': 0,
		},300);
		$('[data-user]').data('nav', 'yes').removeClass('ico_user').addClass('ico_close');
	}else{
		closeUser();
	}
}
$('[data-nav]').on('click', function(){
	var a = $(this).data('nav');
	navMobile(a);
	closeUser();
	return false;
});
$('[data-user]').on('click', function(){
	var a = $(this).data('user');
	userMobile(a);
	closeNav();
	return false;
});
$(document).click(function(e){
	if(!$(e.target).is('[data-nav], [data-nav] *, #top, #top *')){
		closeNav();
	}
	if(!$(e.target).is('[data-user], [data-user] *, .panel, .panel *')){
		closeUser();
	}
});

var h = $('html');
var panel = $('#connect');
var fV = $('.fadeconnect');

window.panelConnect = function(){
	closeNav();
	closeUser();

	if(panel.css('opacity') == 0){
		panel.stop().show();
		panel.stop().animate({top: 50, opacity: 1,},300);
		fV.stop().fadeIn(300);
		h.stop().css({'overflow':'hidden',});
	}else{
		fV.stop().fadeOut(300);
		panel.stop().animate({top: 20, opacity: 0,},300).promise().then(function(){
			panel.stop().hide();
			h.stop().css({'overflow':'auto',});
		});
	}
}

function hidePanelConnect()
{
	fV.stop().fadeOut(300);
	panel.stop().animate({top: 20, opacity: 0,},300).promise().then(function(){
		panel.stop().hide();
		h.stop().css({'overflow':'auto',});
	});
}

$('[data-connect], .fadeconnect').on('click', function(){
	panelConnect();
	return false;
});


$('[data-slidable] h2').on('click', function(){
	console.log('ok');
	var a = $(this).parent('[data-slidable]');
	$('[data-slidable] .slidable').stop().slideUp();
	$('[data-slidable]').attr('data-slidable', '');
	a.children('.slidable').stop().slideDown();
	a.attr('data-slidable', 'active');
});

$("#user-login").on("submit",function(e) {
  	e.preventDefault();
  	$.ajax({
  		type: 'POST',
  		url: '/user/login',
  		data: new FormData(this),
  		contentType: false,             
  		processData:false,
  		success: function(data) {
  			hidePanelConnect();
  			if(data.hasOwnProperty('target_url')) {
  				window.location.replace(data.target_url);
  			}
  			else {
  				if(!window._YGGConfig.segment4Uri) {
					 location.reload();
  				} else {
      				$.getJSON('/user/ajax_usermenu', function(data) {   
      					$('#top_panel').html(data.html);
      					sendNotif('Heureux de vous revoir <strong>' + data.nickname + ' !</strong !','success');
						$.get('/ajax/messages_status', function(data) {
							if(data.notifications.messages_unread_count) 
							{
								$('span[function="messages_counter"]').html(data.notifications.messages_unread_count);
								$('li[function="messages_count"]').fadeIn();
							}
						});
      				});
  				}
  			}
  		} ,
  		error : function(e, xhr, s) {
  			let error = e.responseJSON;
  			if(e.status == 403 && typeof error !== 'undefined') {
				$('#ban_msg_r').hide();
				let ban_msg = $('#ban_msg_login');
				ban_msg.find('.ban_duration').html(error.duration);
				ban_msg.find('#ban_reason').attr('href','/user/ban_reason?h=' + error.reason_key);
				ban_msg.show();
  			}
  			else if(e.status == 403) {
  				$('#login_msg_pass').hide();             	
  				$('#login_msg_mail').show();
  			}
  			else if(e.status == 401) {
  				$('#login_msg_mail').hide();
  				$('#login_msg_pass').show();
  				$('#resetpass').show();
  			} else { 
  				alert('Erreur ajax');	
  			}

  		}
  	});
 });

 if(window._YGGConfig.showLoginForm) {
   	  	 panelConnect();
	      $('#no_logged').fadeTo(3000, 500).slideUp(500, function(){
	      	$('#no_logged').slideUp(1000);
	      });	
  }

  if(window._YGGConfig.bannedAccount) {
	   panelConnect();	
  }

});
