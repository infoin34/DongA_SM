'use strict';

((exports, $)=>{

    // $('#btn-top').on('click', function(){
    //     $('html, body').animate({scrollTop: 0}, 'linear');
    //     return false;
    // });   
    
    $(function(){
		toggleFamily()
	})

    /* 로딩 후 콜백 */
    const afterLoading = (cb)=>{
        window.addEventListener('load', completed, false);
		function completed(){
	 	   cb();
	       window.removeEventListener('load', completed, false);      
	    }
    };

    /* 전체스크롤 막기/풀기 */
    let scrollHeight = 0;
    const bodyScrollBlock = (flag) => {
        if(flag) {
			scrollHeight = ($docu.scrollTop() );
			$('body').addClass('no-scr');
			$('body').css({
				'marin-top': -(scrollHeight)+'px',
			})
		}else {
			$('body').removeAttr('style');
			$('body').removeClass('no-scr');
			$('html, body').scrollTop(scrollHeight);
		}
    }
   
    /* 특정 위치로 스크롤 */
    const scrollMove = (val, time)=>{
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
    //         }
    //     });
	// 	return swiper;
	// } 


    exports.scrollMove = scrollMove;
    exports.bodyScrollBlock = bodyScrollBlock
    exports.popup = popup;
	exports.afterLoading = afterLoading;
	exports.toggleFamily = toggleFamily;
})(window, jQuery);
