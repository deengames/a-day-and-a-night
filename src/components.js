// The Grid component allows an element to be located
//	on a grid of tiles
Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		})
	},

	// Locate this entity at the given position on the grid
	move: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x / Game.map_grid.tile.width, y: this.y / Game.map_grid.tile.height }
		} else {
			this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
			return this;
		}
	},
	
	grid_x: function() {
		return this.x / Game.map_grid.tile.width;
	},
	
	grid_y: function() {
		return this.y / Game.map_grid.tile.height;
	}
});

// An "Actor" is an entity that is drawn in 2D on canvas
//	via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

// Handy movement helper that slides instead of dead stops when bumping against other solids
Crafty.c('MoveAndCollide', {
	init: function() {
		this.requires('Fourway, Collision')
	},
	
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);
		return this;
	},
	
	stopMovement: function () {
		if (this._movement) {
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
