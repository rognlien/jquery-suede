(function($) {
	$.widget("ui.suede", {
		_init: function() {
			var self = this, o = this.options;
			this.element.attr({contenteditable: true});
			
			this.element.keypress(function(e) {
				console.log("Key pressed");
			  switch(e.keyCode) {
			  	case $.ui.keyCode.ENTER:
			  		console.log("return pressed");
			  		
						//var selection = self._getSelection();
						console.log("Event target: " + e.target);
						/**
						 * When hitting return inside an <li> a new <li> is added after the current one.
						 * The content of the current <li> is split at caret position. 
						 */
						if(e.target.tagName == "LI") {
							e.preventDefault();
							console.log("We are in an LI");
							
							var newItem = $("<li></li>").insertAfter(e.target);
							
							var selection = self._getSelection();
							var text = $(e.target).text();
							
							$(e.target).text(text.substring(0, selection.startOffset));
							newItem.text(text.substring(selection.startOffset));
							
							console.log("Selection: " + selection);
							console.log("Selection start: " + selection.startOffset);
							
							newItem.suede();
							newItem.focus();
						}
						/**
						 * When hitting return inside a <p> a new <p> is added after the current one.
						 * The content of the current <p> is split at caret position. 
						 */
						else if(e.target.tagName == "P") {
							e.preventDefault();
							console.log("We are in an P");
							
							var newItem = $("<p></p>").insertAfter(e.target);
							newItem.execCommand("Bold",bool,value);
							var selection = self._getSelection();
							var text = $(e.target).text();
							
							$(e.target).text(text.substring(0, selection.startOffset));
							newItem.text(text.substring(selection.startOffset));
							
							console.log("Selection: " + selection);
							console.log("Selection start: " + selection.startOffset);
							
							newItem.suede();
							newItem.focus();
						}
						
						
			  		break;
			  		
			  		case $.ui.keyCode.UP:
			  			console.log("Arrow up pressed");
			  			$(e.target).next("li").focus();
			  			console.log();
			  		break;
			  	}	
			});
		}

		,_getSelection: function() {
				var selectionObject;
				if (window.getSelection) {
					selectionObject = window.getSelection();
				}
				else if (document.selection) { // should come last; Opera!
					selectionObject = document.selection.createRange();
				}
				if (selectionObject.getRangeAt) {
					return selectionObject.getRangeAt(0);
				}
				else { // Safari!
					var range = document.createRange();
					range.setStart(selectionObject.anchorNode,selectionObject.anchorOffset);
					range.setEnd(selectionObject.focusNode,selectionObject.focusOffset);
					return range;
				}
		}

		,destroy: function() {
			this.element.removeAttr("contenteditable");
			$.widget.prototype.destroy.apply(this, arguments);
			return this;
		}

		,wrap: function(wrapper) {
			var range = this._getSelection();
			console.log("Cursor is at: " + range.startOffset);
			console.log("Wrapping selection in: " + wrapper);	
				
			if(range.startContainer !== range.endContainer) {
				console.log("We are spanning multiple containers");
			}
			else {
				var container = $(range.startContainer).parent(); 
				console.log("We are in the same container");
				var contents = container.html();
				var selected = contents.substring(range.startOffset, range.endOffset);
				
				var wrapped = $(selected).wrap("<b>");
				console.log(contents);
	       		
				//var wrapper = $("<span style='color: red'>" + selected + "</span>");
				container.empty();
				container.append(contents.substring(0, range.startOffset));
				container.append("ffdsfs");
				container.append(contents.substring(range.endOffset));

				return wrapper;
			}
		}
	});

	$.extend($.ui.suede, {
		version: "@VERSION",
		defaults: {
			value: 0
		}
	});
})(jQuery);
