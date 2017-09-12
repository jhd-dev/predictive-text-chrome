'use strict';

(function($, getCaretCoordinates){

	const listOffsetX = 4;
	const listOffsetY = 0;

	let $predictionList = $('<span id="prediction-list">hello</span>');

	$(document).ready(() => {

		$('body').append($predictionList);

		$(':input').on({
			focus(){console.log('focus');
				setTimeout(() => {
					positionList($predictionList, this, listOffsetX, listOffsetY);
					$predictionList.addClass('visible');
				}, 0);
			},
			blur(){
				$predictionList.removeClass('visible');
			},
			input(){
				const oldValue = $(this).val();
				$(this).val(oldValue);
			}
		})

	});

	function positionList($list, textbox, offsetX, offsetY){
		const rect = textbox.getBoundingClientRect();
		const caret = getCaretCoordinates(textbox, textbox.selectionEnd);
		$list.css({
			left: rect.left + window.scrollX - offsetX + caret.left,
			top: rect.top + window.scrollY - offsetY + caret.top - caret.height
		});
	}

})($, getCaretCoordinates);
