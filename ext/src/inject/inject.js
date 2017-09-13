'use strict';

(function($, getCaretCoordinates){

	$(document).ready(() => new WordPredictionInterface().setupEvents());

	class WordPredictionInterface {

		constructor(){
			this.baseWordCountNode = new WordCountNode();
			this.possibleNextWords = [];
			this.$predictionList = $('<span id="prediction-list"></span>');
			this.seperatorChar = ' ';
			this.wordsToShow = 4;
			this.listOffsetX = 0;
			this.listOffsetY = 0;
			this.maxLocalStorageDepth = 2;
			this.maxSyncStorageDepth = 1;
		}

		setupEvents(){
			let self = this;
			$('body').append(self.$predictionList);
			$(':input').on({

				focus(){
					setTimeout(() => {
						self.positionList(this);
						self.$predictionList.addClass('visible');
					}, 0);
				},

				blur(){
					self.$predictionList.removeClass('visible');
				},

				input(){
					self.possibleNextWords = self.baseWordCountNode.getPossibleNextWords(self.splitIntoWords(this.value));
					self.updateListEntries(self.possibleNextWords.slice(0, self.wordsToShow));
				},

				keydown(e){
					if (e.keyCode === 32){ //space
						setTimeout(() => {
							self.positionList(this);
						}, 0);
						self.storeWordUsage(this.value);
					}
				}

			});
		}

		positionList(textbox, offsetX = this.listOffsetX, offsetY = this.listOffsetY){
			const rect = textbox.getBoundingClientRect();
			const caret = getCaretCoordinates(textbox, textbox.selectionEnd);
			this.$predictionList.css({
				left: rect.left + window.scrollX - offsetX + caret.left + 'px',
				top: rect.top + window.scrollY - offsetY - this.$predictionList.outerHeight() + caret.top + 'px'
			});
		}

		updateListEntries(words){
			this.$predictionList.empty();
			words.forEach(word => {
				this.$predictionList.prepend($('<div class="prediction-entry">' + word + '</div>'));
			});
		}

		storeWordUsage(currentText){
			let words = this.splitIntoWords(currentText);
			const newWord = words.pop();
			this.baseWordCountNode.addToCounts(newWord, words);
		}

		splitIntoWords(text){
			return text.replace(/[^a-zA-Z0-9]+/g, this.seperatorChar).trim().toLowerCase().split(this.seperatorChar);
		}

	}

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

		getPossibleNextWords(words){
			let previousWords = words;
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

})($, getCaretCoordinates);
