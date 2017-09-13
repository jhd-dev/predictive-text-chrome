'use strict';

(function($, getCaretCoordinates){

	const wordsToShow = 4;

	const listOffsetX = 0;
	const listOffsetY = 0;

	const maxLocalStorageDepth = 2;
	const maxSyncStorageDepth = 1;

	const seperatorChar = ' ';

	let $predictionList = $('<span id="prediction-list"></span>');
	let possibleNextWords = [];

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

		getChildNodes(words){
			let nodes = [];
			let currentWordCountNode = this;
			for (let word of words){
				nodes.push(currentWordCountNode);
				if (typeof currentWordCountNode.previousWords[word] === 'undefined'){
					break;
				} else {
					currentWordCountNode = currentWordCountNode.previousWords[word];
				}
			}
			return nodes;
		}

		getPossibleNextWords(currentText){
			let previousWords = splitIntoWords(currentText);
			const currentWord = previousWords.pop();
			let nextWords = [];
			const wordCountNodes = this.getChildNodes(previousWords).reverse();
			wordCountNodes.forEach(node => {
				Object.keys(node.nextWordCounts)
					.filter(word => word.substring(0, currentWord.length) === currentWord)
					.sort((word1, word2) => node.nextWordCounts[word1] > node.nextWordCounts[word2])
					.forEach(word => nextWords.push(word));
			});
			return [...new Set(nextWords)];
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
				possibleNextWords = baseWordCountNode.getPossibleNextWords(this.value);
				updateListEntries($predictionList, possibleNextWords.slice(0, wordsToShow));
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

	function storeWordUsage(currentText){
		let words = splitIntoWords(currentText);
		const newWord = words.pop();
		baseWordCountNode.addToCounts(newWord, words);
		console.log(baseWordCountNode);
	}

	function splitIntoWords(text){
		return text.replace(/[^a-zA-Z0-9]+/g, seperatorChar).trim().toLowerCase().split(seperatorChar);
	}

})($, getCaretCoordinates);
