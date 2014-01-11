// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Color, Solid')
			.color('rgb(20, 125, 40)');
	}
});

// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
	init: function() {
		this.requires('Actor, Color, Solid')
			.color('rgb(64, 215, 78)');
	}
});

// This is the player-controlled character
Crafty.c('Player', {
	init: function() {
		this.requires('Actor, Fourway, Color, Grid, Collision')
			.fourway(4)
			.color('rgb(80, 168, 215)')
			.stopOnSolids();
	},
	
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);
		return this;
	},
	
	stopMovement: function() {
		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	}
});