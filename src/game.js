Crafty.load(['assets/images/player.png', 'assets/images/world.png'], function() {
	Crafty.sprite(32, 32, 'assets/images/player.png', {
		sprite_player:	[0, 0]
	});
	
	Crafty.sprite(32, 32, 'assets/images/world.png', {
		sprite_wall: [0, 0],
		sprite_tree: [1, 0]
	});
});

Game = {
	// This defines our grid's size and the size of each of its tiles
	width: 800,
	height: 608,
	
	map_grid: {
		width:  25,
		height: 19,
		tile: {
			width:  32,
			height: 32
		}
	},
	
	player_start: {
		x: 5,
		y: 5
	},
	
	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},
	
	// The total height of the game screen. Since our grid takes up the entire screen
	//  this is just the height of a tile times the height of the grid
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},
	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		Crafty.background('#d2ffa6');		
		Game.init_map();
	},
	
	init_map: function() {
		// Place a tree at every edge square on our grid of 16x16 tiles
		for (var x = 0; x < Game.map_grid.width; x++) {
			for (var y = 0; y < Game.map_grid.height; y++) {
				var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

				if (at_edge) {
					// Place a wall entity at the current tile
					Crafty.e('Wall').move_on_grid(x, y);
				} else if (Math.random() < 0.06 && x != Game.player_start.x && y != Game.player_start.y) {
					Crafty.e('Tree').move_on_grid(x, y);
				}
			}
		}
		
		Crafty.e('Player').move_on_grid(Game.player_start.x, Game.player_start.y);
	}
}