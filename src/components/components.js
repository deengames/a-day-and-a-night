// The Grid component allows an element to be located
//	on a grid of tiles
Crafty.c('Grid', {
	size: function(width, height) {
		this.attr({
			width: width,
			height: height
		})
	},
	
	// Locate this entity at the given position on the grid
	move: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x / this.width, y: this.y / this.height }
		} else {
			this.attr({ x: x * this.width, y: y * this.height });
			return this;
		}
	},
	
	gridX: function() {
		return Math.floor(this.x / this.width);
	},
	
	gridY: function() {
		return Math.floor(this.y / this.height);
	}
});

// An "Actor" is an entity that is drawn in 2D on canvas
//	via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	}
});

// Handy movement helper that slides instead of dead stops when bumping against other solids
// Warning: depends on internal implementation details (_movement). 
// This may break when you update CraftyJS.
Crafty.c('MoveAndCollide', {
	init: function() {
		this.requires('Fourway, Collision');			
	},
	
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);
		return this;
	},
	
	stopMovement: function(data) {
		var overlap = data[0].overlap;
		// null: MBR collision. It's solid.
		// 1.5: prevent getting stuck in collisions.
		var overlaps = (overlap == null || Math.abs(overlap) >= 1.5);
		if (this._movement && overlaps) {
			this.x -= this._movement.x;
			if (this.hit('Solid') != false) {
				this.x += this._movement.x;
				this.y -= this._movement.y;
				if (this.hit('Solid') != false) {
					this.x -= this._movement.x;					
				}
			}
		} else {
			this._speed = 0;
		}
	}
});
