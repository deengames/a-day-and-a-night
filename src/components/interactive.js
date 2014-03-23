Crafty.c('Interactive', {

	onInteract: function(func) {
		this.interactFunction = func;
	},
	
	interact: function() {
		if (this.interactFunction != null) {
			this.interactFunction();
		}
	},
	
	talk: function() {	
		var obj = null;		
		
		// Do we have a message?
		if (this.onTalk != null || this.messages.length > 0) {
			// Initialize dialog.
			// If there's no dialog, or multiple messages, do this.			
			if (typeof(dialog) == 'undefined' || this.messages.length > 0) {
					
				if (typeof(dialog) == 'undefined') {
					// no "var" keyword => global scope
					dialog = Crafty.e('DialogBox');				
				}
				
				if (this.onTalk != null) {
					obj = this.onTalk();
				} else {
					obj = this.messages[Math.floor(Math.random() * this.messages.length)];
				}
				
				dialog.setSource(this, this.x, this.y);
				
				if (obj instanceof Array) {
					if (typeof(conversationIndex) == 'undefined') {
						conversationIndex = 0;
					} else {
						conversationIndex += 1;                        
						if (conversationIndex >= obj.length) {
                            // This is for conversations (without choices)
                            if (typeof(awaitingChoice) == 'undefined') {
                                dialog.close();
                            }
							return;
						}
					}
					
					message = obj[conversationIndex];
				} else {
					message = obj;
				}
				
				dialog.message(message);				
			} else {
				dialog.close();
                delete dialog;
			}
		}
	}
});
