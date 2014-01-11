// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Color')
			.color('rgb(20, 125, 40)');
	},
});

// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
	init: function() {
		this.requires('Actor, Color')
			.color('rgb(64, 215, 78)');
	},
});