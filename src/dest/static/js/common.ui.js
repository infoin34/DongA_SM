'use strict';

((exports, $)=>{

    // $('#btn-top').on('click', function(){
    //     $('html, body').animate({scrollTop: 0}, 'linear');
    //     return false;
    // });   

    /* 로딩 후 콜백 */
	function afterLoading(cb){
		window.addEventListener('load', completed, false);
		function completed(){
	 	   cb();
	       window.removeEventListener('load', completed, false);      
	    }
	}

    /* 전체스크롤 막기/풀기 */
    let scrollHeight = 0;
	function bodyScrollBlock(flag){
		if(flag) {
			scrollHeight = ($(window).scrollTop() );
			$('html, body').addClass('no-scr');
			$('html, body').css({
				'marin-top': -(scrollHeight)+'px',
			})
		}else {
			$('html, body').removeAttr('style');
			$('html, body').removeClass('no-scr');
			$('html, body').scrollTop(scrollHeight);
		}
	}
   
    /* 특정 위치로 스크롤 */
	function scrollMove (val, time){
        $('html, body').animate({scrollTop: val}, time || 300);
    }   

    /* 팝업 */
    const popup = {
		targetLayer : '',
		guideZindex : 1020,
		targetArr : [],
		freezeTop : 0,
		popupObj : {},
		popupSetTimer : null,
		oldHeight : 0,
		layerPopup : function(obj) {
			'use strict'
			var $obj = (typeof obj === 'string') ? $(obj) : obj ;

			popupBase.layerPopupInit($obj);
		},
		layerPopupInit: function($obj) {
			'use strict'
			var $obj = $obj,
				$wrapper = $obj.find('.wrapper'),
				$closeBtn = $obj.find('.close, .fn-close, .btn-close'),
				$popup = $obj.find('.popup'),
				$close = $obj.find('.btn.close');

			popupBase.targetLayer = $obj;
			$.each(popupBase.targetArr, function(i) {
				if (popupBase.targetArr[i].attr('id') == $obj.attr('id')) popupBase.targetArr.splice(i,1);
			})
			popupBase.targetArr.push($obj);

			$obj.css({
				'display': 'block',
				'z-index': popupBase.guideZindex + (popupBase.targetArr.length + 1)
			});

			$popup.css({
				'margin-top': '10px',
			});

			if (popupBase.targetArr.length == 1) {
				if( !$body.hasClass('layer-open') ) {
					bodyScrollBlock(true);
				}
			}
			$body.append($obj);

			$closeBtn.click(function (e) {
				e.preventDefault();
				popupBase.closePopup('#'+$obj.attr('id'));
			});

			// layer-popup-fix 클래스를 추가하면 dim 클릭해도 닫히지 않음  20-10-23
			$obj.on('click', function(e) {				
				if ( !$(this).hasClass('layer-popup-fix') && e.target.classList.contains('popup-wrapper') || e.target.classList.contains('layer-popup') ) {
					popupBase.closePopup('#'+$obj.attr('id'))
				} else {
					
				}
			});
		},
		popupCloseAllFn : function() {
			'use strict'

			$.each(popupBase.targetArr, function(i) {
				popupBase.closePopup();
			});
		},
		closePopup : function(id) {
			var $tg = id ? $(id) : popupBase.targetArr[popupBase.targetArr.length - 1] ;
			$tg.css({ 'display': 'none', 'z-index': 0 });
			$.each(popupBase.targetArr, function(i) {
				if (popupBase.targetArr[i].attr('id') == $tg.attr('id')) {
					popupBase.targetArr.splice(i,1);
					return false;
				}
			})
			popupBase.targetLayer = '';
			if (popupBase.targetArr.length == 0) {
				if( !$body.hasClass('layer-open') ) {
					bodyScrollBlock(false);
				}
			}
		}		
	};

    // function swiperSlide(target){
	// 	var swiper = new Swiper(target + ' .swiper-container', {
	// 		slidesPerView: 'auto',
    //         spaceBetween: 0,
    //         navigation: {
    //             nextEl: target + ' .slider-navigation .swiper-button-next',
    //             prevEl: target + ' .slider-navigation .swiper-button-prev',
    //         },
	//  		pagination: {
	//			 	el: target +  '.swiper-pagination',
	//			 	clickable: true,
	//			 },
    //     });
	// 	return swiper;
	// } 

	/* 헤더 */
	function headerEvt(){
		let $body = $("body");
		let $header = $(".header");
		let $gnb = $header.find(".gnb");
		let $line = $gnb.find(".gnb-line");
		let $trigger = $('[data-js-gnb="trigger"]');
		let $list = $('[data-js-gnb="list"]');
		let $headerH = $header.height();
		let $nav = $header.find(".nav");
		let $navBtn = $header.find(".btn-menu");

		// gnb 진입시 open
		$gnb.on({
			mouseenter: function(){
				$header.addClass("open");
			}
		})

		// 헤더 벗어날 때 close
		$header.on({
			mouseleave: function(){
				if( $(this).hasClass("is-full") == false){
					let $gnbY = $gnb.offset().left;

					$header.removeClass("open");
					$list.hide();
					$header.height( $headerH );

					$line.css({ "opacity" : "0" });
				}
			}
		})

		// gnb 상위뎁스 호버시 open
		$trigger.each(function(index, item){
			let $this = $(item);
			let $thislist = $this.siblings('ul');
			let $listName = $thislist.attr("class");

			$this.on({
				mouseenter: function(){
					$( '.' + $listName ).not( $thislist ).hide();
					$( '.' + $listName ).not( $thislist ).find('ul').hide();		

					if ( $thislist.hasClass("gnb-depth2") == true ){
						$thislist.css({ "display":"flex" });
						let $changeH = $headerH + $thislist.innerHeight();

						let $thisY = $this.offset().left;
						let $gnbY = $gnb.offset().left;
						let $nowY = $line.offset().left;
						let $thisW = $this.width();
						$line.css({ "left" : $thisY - $gnbY , "width" : $thisW,  "opacity" : 1 });
						
						$header.height( $changeH );
					} else if ($thislist.hasClass("gnb-depth3") == true){
						$thislist.stop().show();
					}
				}
			})
			
			if($thislist.hasClass("gnb-depth3") == true){
				$this.parent().on({
					mouseleave: function(){
						$thislist.stop().hide();
						let $nowH = $headerH + $this.parents(".gnb-depth2").innerHeight();
						$header.height( $nowH );
					}
				})
				$this.on({
					mouseenter: function(){	
						let $nowH = $headerH + $this.parents(".gnb-depth2").innerHeight();
						$header.height( $nowH );
					}
				})

			};
		})

		// 메뉴버튼 클릭시 네비게이션 오픈
		$navBtn.on({
			click: function(){
				$(this).toggleClass("on");
				$header.removeClass("open");
				$header.toggleClass("is-full");
				$list.hide();
				$header.find(".header-top").stop().fadeToggle();
				$(this).siblings(".btn-support").stop().fadeToggle(200);
				$nav.stop().fadeToggle();
				$line.css({ "opacity" : 0 })

				let $btnAni = gsap.timeline();
				let $line1 = $(this).find(".line1");
				let $line2 = $(this).find(".line2");
				let $line3 = $(this).find(".line3");
				let $lineW = $line1.width();

				if (window.innerWidth > 992) {
					$gnb.stop().fadeToggle();
				}else {
					$gnb.hide();
				}

				if( $(this).hasClass("on") === true){
					$header.css('height', '100vh');
					$btnAni.set( $line1, { y: 0, rotate: 0 })
					$btnAni.set( $line2, { width: $lineW })
					$btnAni.set( $line3, { y: 0, rotate: 0 })

					$btnAni.to( $line1, 0.15,{ y: 11, rotate: 0 })
					$btnAni.to( $line3, 0.15,{ y: -11, rotate: 0 }, "<")
					$btnAni.to( $line2, 0,{ width: 0 })
					$btnAni.to( $line1, 0.2,{ y: 11, rotate: 45 }, ">0.15")
					$btnAni.to( $line3, 0.2,{ y: -11, rotate: -45 }, "<")


					setTimeout(function(){
						$body.css({ "overflow" : "hidden" });
						$header.css({ "overflow-y" : "scroll" });
					}, 300)
				}else {
					$header.css('height', $headerH);
					$btnAni.set( $line1, { y: 11, rotate: 45 })
					$btnAni.set( $line2, { width: 0 })
					$btnAni.set( $line3, { y: -11, rotate: -45 })

					$btnAni.to( $line1, 0.2,{ y: 11, rotate: 0 })
					$btnAni.to( $line3, 0.2,{ y: -11, rotate: 0 }, "<")
					$btnAni.to( $line2, 0,{ width: $lineW })
					$btnAni.to( $line1, 0.15,{ y: 0, rotate: 0 }, ">0.15")
					$btnAni.to( $line3, 0.15,{ y: 0, rotate: 0 }, "<")

					
					$body.css({ "overflow" : "visible" });
					$header.css({ "overflow-y" : "hidden" });
				}
			}
		})
	}

	/* 푸터 패밀리 사이트 */
	function toggleFamily(){
		var $footer = $(".footer");
		var $button = $footer.find($(".footer-familySelect"));
		var $list = $footer.find($(".footer-familyList"));

		$button.off('click.button').on('click.button', function(){
			$list.stop().slideToggle()
		});
	}

	/* 헤더 스크롤시 */ 
	function headerScrollEvt(){
		if ( $(".header").hasClass("is-full") == false ){
			if(currentScr == 0) {
				$(".header").removeClass("scrollD");
				$(".header").removeClass("scrollU");
			} else if ( currentScr > lastScr) {
				$(".header").addClass("scrollD");    
			} else if (currentScr < lastScr){
				$(".header").addClass("scrollU");
				$(".header").removeClass("scrollD");
			}
			lastScr = currentScr;
		}
	}

	/* 스크롤 애니 이벤트*/
	function scrollAni(){
		let setScrT = parseInt(currentScr + ($(window).height()*0.9));		
		$('.ani').each(function(i){	
			if(setScrT > $(this).offset().top){											
				if(!$(this).hasClass('active')){
					$(this).addClass('active');					
				}			
			}else{
				if($(this).hasClass('active')) {
					$(this).removeClass('active');
				}
			}
		});

		if( currentScr > 130) {
			$(".btn-top").addClass("show");
		}else {
			$(".btn-top").removeClass("show");
		}
	}
	
	let currentScr, lastScr = 0;
	function scrollEv(){
		//현재 스크롤값
		currentScr = $(window).scrollTop();

		//스크롤 모션
		headerScrollEvt();
		scrollAni();

		// 현재 스크롤값은 저장
		lastScr = currentScr;
	}
	
	/* 서브 비주얼 불러오기 이벤트 */
	// function subVisScrLoad() {
	// 	$(".subVisScr").each(function(){
	// 		let $this = $(this);
	// 		setTimeout(function(){
	// 			$this.addClass("active");
	// 		}, 2500)
	// 	});
	// } 

	$(window).on('scroll', function(){
		scrollEv();
	});
	$(window).ready(function(){
		scrollEv();
	});

	/* 입력필드(검색) */ 
	function textFeildEvt(){
		$(".txtField").each(function(){
			let $this = $(this);
			let $input = $this.find(".tf-input");
			let $delete = $this.find(".tf-delete");

			$input.on({
				focus: function(){
					$delete.addClass("on");
				}
			});

			$delete.on({
				click: function(){
					console.log($input);
					$input.val("");
					$(this).removeClass("on");
				}
			});

		})
	}

	/* 나이스 셀렉트 */
	function selectNice(){
		$(".cSelect").each(function(){
			$(this).niceSelect();
		})
	}

	// function scrTit(){
	// 	let $subTit = $(".subVisScr");
	// 	let $subCont = $(".scrCont");
	// 	gsap.to($subTit, {
	// 		duration: 2,
	// 		x: 500,
	// 		rotation: 360,
	// 		borderRadius: 100,
		
	// 		scrollTrigger: {
	// 			trigger: $subCont,
	// 			start: "top 50%",
	// 			end: "top 100px",
	// 			pin: true,
	// 			scrub: true,    
	// 			markers: true,
	// 		}
	// 	});
	// }


    exports.scrollMove = scrollMove;
    exports.bodyScrollBlock = bodyScrollBlock
    exports.popup = popup;
	exports.afterLoading = afterLoading;
    
    $(function(){
		headerEvt()
		headerScrollEvt()
		toggleFamily()
		textFeildEvt()
		selectNice()
		subVisScrLoad()
		// scrTit()
	});
})(window, jQuery);
