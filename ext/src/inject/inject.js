'use strict';

(function($, getCaretCoordinates){

	const listOffsetX = 0;
	const listOffsetY = 0;

	let $predictionList = $('<span id="prediction-list">hello</span>');

	$(document).ready(() => {

		$('body').append($predictionList);

		$(':input').on({
			focus(){
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
				updateListEntries($predictionList, getPossibleNextWords(oldValue));
			},
			keydown(e){
				if (e.keyCode === 32){ //space
					setTimeout(() => {
						positionList($predictionList, this, listOffsetX, listOffsetY);
					}, 0);
				}
			}
		});

	});

	function positionList($list, textbox, offsetX, offsetY){
		const rect = textbox.getBoundingClientRect();
		const caret = getCaretCoordinates(textbox, textbox.selectionEnd);
		$list.css({
			left: rect.left + window.scrollX - offsetX + caret.left + 'px',
			top: rect.top + window.scrollY - offsetY - $list.outerHeight() + caret.top + 'px'
		});
	}

	function updateListEntries($list, words){
		$list.empty();
		words.forEach(word => {
			$list.prepend($('<div class="prediction-entry">' + word + '</div>'));
		});
	}

	function getPossibleNextWords(currentText){
		return ['hello', 'how', 'are', 'you'];
	}

})($, getCaretCoordinates);
