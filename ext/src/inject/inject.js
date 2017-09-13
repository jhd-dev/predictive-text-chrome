'use strict';

(function($, getCaretCoordinates){

	const listOffsetX = 0;
	const listOffsetY = 0;

	const maxLocalStorageDepth = 2;
	const maxSyncStorageDepth = 1;

	const seperatorChar = ' ';

	let $predictionList = $('<span id="prediction-list">hello</span>');

	class WordCountNode {
		
		constructor(){
			this.previousWords = {};
			this.nextWordCounts = {};
		}

		addToCounts(newWord, previousWords){
			let currentWordCountNode = this;
			for (let word of previousWords.reverse()){
				if (typeof currentWordCountNode.nextWordCounts[newWord] === 'number'){
					currentWordCountNode.nextWordCounts[newWord] ++;
				} else {
					currentWordCountNode.nextWordCounts[newWord] = 1;
				}
				if (typeof currentWordCountNode.previousWords[word] === 'undefined'){
					currentWordCountNode.previousWords[word] = new WordCountNode();
				}
				currentWordCountNode = currentWordCountNode.previousWords[word];
			};
		}

	}

	let baseWordCountNode = new WordCountNode();

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
					storeWordUsage(this.value);
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

	function storeWordUsage(currentText){
		let words = splitIntoWords(currentText);//console.log(currentText, words);
		const newWord = words.pop();
		baseWordCountNode.addToCounts(newWord, words);
		console.log(baseWordCountNode);
	}

	function splitIntoWords(text){
		return text.replace(/[^a-zA-Z0-9]+/g, seperatorChar).trim().toLowerCase().split(seperatorChar);
	}

})($, getCaretCoordinates);
