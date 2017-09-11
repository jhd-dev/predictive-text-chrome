$(document).ready(() => {

	let $predictionList = $('<span id="prediction-list">hello</span>');

	$('body').append($predictionList);

	$(':input').on({
		focus(){
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
