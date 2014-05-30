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
					obj = this.messages;
				}
				
				dialog.setSource(this, this.x, this.y);
				dialog.message(obj);				
			} else {
				dialog.close();
                delete dialog;
			}
		}
	}
});
