Crafty.c('Interactive', {

	onInteract: function(func) {
		this.interactFunction = func;
	},
	
	interact: function() {
		if (this.interactFunction != null) {
			this.interactFunction();
		}
	}
});
