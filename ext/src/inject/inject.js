(function($, getCaretCoordinates){

	let $predictionList = $('<span id="prediction-list">hello</span>');

	$(document).ready(() => {

		$('body').append($predictionList);

		$(':input').on({
			focus(){console.log('focus');
				setTimeout(() => positionList($predictionList, this), 0);
				$predictionList.addClass('visible');
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

	function positionList($list, textbox){
		const caret = getCaretCoordinates(textbox, textbox.selectionEnd);
		$list.css({
			left: caret.left,
			top: caret.top
		});
	}

})($, getCaretCoordinates);
