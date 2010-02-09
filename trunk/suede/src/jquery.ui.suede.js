(function($) {
	$.widget("ui.suede", {
		
		_init: function() {
			var self = this
			var o = this.options;
			this.element.attr({contenteditable: true});
			
			this.element.keypress(function(e) {
				self._handleKeyPress(e);
			});
			
			this.element.bind("contextmenu", function(e) {
				var menu = $("body").data("suede");
				if(!menu) {
					console.log("Context menu");
					var menu = $("<div/>", {"class": "contextual"}).appendTo("body");
					$("body").data("suede", menu);
				}
				menu.empty();
				menu.html("<ul><li>Bold</li><li>Italic</li><li>fsdfdsf</li><li>fsdfdsf</li></ul>");
        return false;
			});
			
		}
	
		/**
		 * Get the key code from the event for all platforms
		 */
	 ,_getKeyCode: function(e) {
			var code;
			if (!e) var e = window.event;
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			return code;
		}




	
		,_handleKeyPress: function(e) {
			
			var self = this;
			var o = this.options;
			
			
			if(e.metaKey) {
				e.preventDefault();
				console.log("CMD pressed");
				console.log("Key pressed: " + (e.metaKey ? 'cmd-' : '') + self._getKeyCode(e));
			}
			
			
		  switch(self._getKeyCode(e)) {
		  	case 231:
		  		if(e.metaKey) {
		  			e.preventDefault();
		  			console.log("Cmd-b pressed");
		  			self.wrap("strong");
		  		}
		  		break;
		  	
		  	case $.ui.keyCode.ENTER:
		  		console.log("return pressed");
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
						
						var parts = [];
						parts[0] = text.substring(0, selection.startOffset);
						parts[1] = text.substring(selection.startOffset);
						//var oldText = 
						//var newLi = text.substring(selection.startOffset);
						
						$(e.target).text(parts[0]);
						newItem.text(parts[1]);
						
						newItem.suede();
						newItem.focus();
						self._trigger("change");
					}
					/**
					 * When hitting return inside a <p> a new <p> is added after the current one.
					 * The content of the current <p> is split at caret position. 
					 */
					else if(e.target.tagName == "P") {
						e.preventDefault();
						console.log("We are in an P");
						
						var newItem = $("<p></p>").insertAfter(e.target);
						var selection = self._getSelection();
						var text = $(e.target).text();
						
						var parts = [];
						parts[0] = text.substring(0, selection.startOffset);
						parts[1] = text.substring(selection.startOffset);
						
						$(e.target).text(parts[0]);
						newItem.text(parts[1]);
						
						console.log("Selection: " + selection);
						console.log("Selection start: " + selection.startOffset);
						
						newItem.suede();
						newItem.focus();
						self._trigger("change");
					}
					
					
		  		break;
		  		
		  		case $.ui.keyCode.UP:
		  			console.log("Arrow up pressed");
		  			$(e.target).next("li").focus();
		  			console.log();
		  		break;
		  	}	

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

		,wrap: function(wrapper, attributes) {
			var self = this;
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
				console.log("Selected text: " + selected);
				var prefix = contents.substring(0, range.startOffset);
				var postfix = contents.substring(range.endOffset);
				var wrapped = $("<" + wrapper + "/>", attributes).text(selected);
				console.log("Wrapped: " + wrapped);
	      console.log("Starts at: " + prefix);
	      console.log("Ends at: " + postfix);
				container.empty();
				container.append(prefix);
				container.append(wrapped);
				container.append(postfix);

				self._trigger("change");
				return wrapper;
			}
		}
	});

	$.extend($.ui.suede, {
		version: "@VERSION",
		defaults: {
			value: 0
			,change:function() {}
		}
	});
})(jQuery);
