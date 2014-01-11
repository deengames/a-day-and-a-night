// A Wall is a solid wall.
Crafty.c('Wall', {
	init: function() {
		this.requires('Actor, Color, Solid, sprite_wall')
			.color('none');
	}
});

// A tree is like a wall. But greener.
Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Color, Solid, sprite_tree')
			.color('none')
	}
});

// This is the player-controlled character
Crafty.c('Player', {
	init: function() {
		this.requires('Actor, Color, MoveAndCollide, sprite_player')
			.fourway(4)			
			.color('none')
			.stopOnSolids();
	},
	
	
});

Crafty.c('Transition', {
	init: function() {
		this.requires('Actor, Color')
			.color('rgb(255, 0, 0)');
	}
});