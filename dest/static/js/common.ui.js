'use strict';

((exports, $)=>{
	window.isMobile = 'ontouchstart' in window || window.DocumentTouch  && document instanceof DocumentTouch;
	// window.isMain = window.isMain || undefined;


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
		guideZindex : 1020,
		targetArr : [],
		freezeTop : 0,
		popupObj : {},
		popupSetTimer : null,
		oldHeight : 0,
		open : function(obj) {
			'use strict'
			let $obj = (typeof obj === 'string') ? $(obj) : obj ;

			popup.layerPopupInit($obj);
		},
		layerPopupInit: function(obj) {
			'use strict'
			let $obj = obj,
				$wrapper = $obj.find('.popup-wrap'),
				$closeBtn = $obj.find('[data-js-pop="close"]');

			$.each(popup.targetArr, function(i) {
				if (popup.targetArr[i].attr('data-pop') == $obj.attr('data-pop')) popup.targetArr.splice(i,1);
			})
			popup.targetArr.push($obj);

			popup.guideZindex++;
			$obj.attr('data-pop', popup.guideZindex);
			$obj.css({
				'display': 'block',
				'z-index': popup.guideZindex
			});

			if (popup.targetArr.length == 1) {
				if(!$('html').hasClass('layer-open') ) {
					bodyScrollBlock(true);
				}
			}
			$('html').append($obj);

			$closeBtn.click(function (e) {
				e.preventDefault();
				popup.closePopup(this);
			});

			// layer-popup-fix 클래스를 추가하면 dim 클릭해도 닫히지 않음 
			$obj.on('click', function(e) {				
				if (!$(this).hasClass('layer-popup-fix') && e.target.classList.contains('popup-wrap')) {
					popup.closePopup(this);
				}
			});
		},
		popupCloseAllFn : function() {
			'use strict'
			$.each(popup.targetArr, function(i) {
				popup.closePopup();
			});
		},
		closePopup : function(target) {
			let $target = $(target),
			    $pop = $target.hasClass('layer-popup') ? $target : $target.parents('.layer-popup');
			
			$.each(popup.targetArr, function(i) {
				if (popup.targetArr[i].attr('data-pop') == $pop.attr('data-pop')) {
					popup.targetArr.splice(i,1);
				}
			});
			if (popup.targetArr.length == 0) {
				if( !$('html').hasClass('layer-open') ) {
					bodyScrollBlock(false);
				}
			}			
			$pop.css({ 'display': 'none', 'z-index': 0 });
		},
		confirm : function(obj){
			let btns = '';
			let _ = this;

			if(typeof(obj) == 'string'){
				$('.pop-confirm .confirm-text').html(obj);
			}else{
				$('.pop-confirm .confirm-text').html(obj.text);
			}

			if(obj.cancel) btns += '<a href="#" class="btn-type-c btn-cancel">취소</a>';
			btns += '<a href="#" class="btn-type-b btn-check">확인</a>';

			$('.pop-confirm .btn-wrap').html(btns);

			$('.pop-confirm .btn-check').off('click');
			$('.pop-confirm .btn-check').on('click', function(){
				obj.check && obj.check();
				_.closePopup('.pop-confirm');				
				return false;
			});
			
			$('.pop-confirm .btn-cancel').off('click');
			$('.pop-confirm .btn-cancel').on('click', function(){
				obj.cancel && obj.cancel();
				_.closePopup('.pop-confirm');
				return false;
			});			
			_.open('.pop-confirm');			
		}		
	};
	/* 헤더 */
	function headerEvt(){
		let $body = $("body");
		let $header = $(".header");
		let $gnb = $header.find(".gnb");
		let $line = $gnb.find(".gnb-line");
		let $trigger = $('[data-js-gnb="trigger"]');
		let $list = $('[data-js-gnb="list"]');
		let $nav = $header.find(".nav");
		let $navBtn = $header.find(".btn-menu");
		let $headerH = $header.height();
		
		function windowSize(){
			$header.height( $header.css('min-height'));
			$headerH = $header.height();

			if( $(window).width() < 992) {
				$gnb.hide();
			}
			else {
				$gnb.show();
			}		
		}

		if(!window.isMobile){//---pc일때
			$nav.addClass('isPc');	
			$navBtn.on({
				click: function(){
					$(this).siblings(".btn-support").toggleClass("hide");
				}
			})
		
			$(window).on ({
				resize : function(){ 
					windowSize();
				},
	
				load : function() {
					windowSize();
				},
			})			
		}else{//---mo 일때
			$nav.addClass('isMo');

			let $depth1Btn = $nav.find(".nav-depth1-li > a");
			let $depth3Btn = $nav.find(".has-dept3");

			$depth1Btn.each(function(item) {
				$(this).attr('href', "javascript:void(0);");
				let $depth2 = $(this).siblings(".nav-depth2");
				$(this).on({
					click: function(){
						$depth2.stop().slideToggle();
					}
				})
			})

			$depth3Btn.each(function(item) {
				$(this).attr('href', "javascript:void(0);");
				let $depth3 = $(this).siblings(".nav-depth3");
				$(this).on({
					click: function(){
						$(this).toggleClass("on")
						$depth3.stop().slideToggle();
					}
				})
			})

			// $gnb.addClass("hide");		
		}
		  
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
				$nav.stop().fadeToggle();
				$line.css({ "opacity" : 0 })

				let $btnAni = gsap.timeline();
				let $line1 = $(this).find(".line1");
				let $line2 = $(this).find(".line2");
				let $line3 = $(this).find(".line3");
				let $lineW = $line1.width();
				if(!window.isMobile){//---pc일때
					if (window.innerWidth > 992) {
						$gnb.stop().fadeToggle();
					}else {
						$gnb.hide();
					}
				}

				if( $(this).hasClass("on") === true){
					$header.css('height', '100vh');
					$btnAni.set( $line1, { y: 0, rotate: 0 })
					$btnAni.set( $line2, { maxWidth: $lineW })
					$btnAni.set( $line3, { y: 0, rotate: 0 })

					$btnAni.to( $line1, 0.15,{ y: '1.1rem', rotate: 0 })
					$btnAni.to( $line3, 0.15,{ y: '-1.1rem', rotate: 0 }, "<")
					$btnAni.to( $line2, 0,{ maxWidth: 0 })
					$btnAni.to( $line1, 0.2,{ y: '1.1rem', rotate: 45 }, ">0.15")
					$btnAni.to( $line3, 0.2,{ y: '-1.1rem', rotate: -45 }, "<")


					setTimeout(function(){
						$body.css({ "overflow" : "hidden" });
						$header.css({ "overflow-y" : "scroll" });
					}, 300)
				}else {
					$header.css('height', $headerH);
					$btnAni.set( $line1, { y: 11, rotate: 45 })
					$btnAni.set( $line2, { maxWidth: 0 })
					$btnAni.set( $line3, { y: -11, rotate: -45 })

					$btnAni.to( $line1, 0.2,{ y: 11, rotate: 0 })
					$btnAni.to( $line3, 0.2,{ y: -11, rotate: 0 }, "<")
					$btnAni.to( $line2, 0,{ maxWidth: $lineW })
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
			$list.toggleClass("on");
			$button.toggleClass("on");
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
		$('.ani').each(function(index, item){	
			if(setScrT > $(item).offset().top) {											
				if(!$(item).hasClass('active')){
					$(item).addClass('active');					
				}			
			}else {
				if($(item).hasClass('active')) {
					$(item).removeClass('active');
				}
			}
		});		

		$('.oneTime').each(function(index, item){	
			if(setScrT > $(item).offset().top) {											
				if(!$(item).hasClass('active')){
					$(item).addClass('active');					
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

	function cSlide(){
		if( $('.cslide-slide').length ) {
			var cSlide = new Swiper(".cslide-slide", {
				slidesPerView: "1",
				spaceBetween: 24,
				// freeMode: true,
				// mousewheel: true,
				threshold: 50,
				
				keyboard: {
					enabled: true,
				},
		
				pagination: {
					el: ".cslide-pagination",
					type: "progressbar",
				},		

				breakpoints: {
					768: {
						slidesPerView: 2,
					},
				},
			});
		}
	}
	

	$(window).on('scroll', function(){
		scrollEv();
	});
	$(window).ready(function(){
		scrollEv(); 
		cSlide()
	});
	
	// let $trigger = $('[data-js-gnb="trigger"]');

	/* 입력필드(검색) */ 
	function textFeildEvt(){
		$(".txtField").each(function(){
			let $this = $(this);
			let $input = $this.find(".tf-input");
			let $delete = $this.find(".tf-delete");

			$input.on({
				focus: function(){
					$delete.addClass("on");
					$this.addClass("focus");
				},
				blur: function(){
					$this.removeClass("focus");
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
	};

	/* 탭 이벤트 */
	function tabEvt(){
		$(".cTab").each(function(){
			let $tab = $(this);
			let $btn = $tab.find(".cTab-btn");
			$btn.each(function(){
				$(this).on({
					click: function(){
						$(this).addClass("on");
						$btn.not( $(this) ).removeClass("on")
					}
				});
			})
		})
	}

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
		tabEvt()
		// scrTit()

		if(!window.isMobile){//---pc일때
			$('html').addClass('window-pc');	
		}else{//---mo 일때
			$('html').addClass('window-mo');
		}

	});
})(window, jQuery);
