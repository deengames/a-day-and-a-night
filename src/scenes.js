Crafty.scene('Loading', function() {

	Crafty.background('black');
	
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
		.text('Loading ...')
		.attr({ x: 0, y: (Game.height() - 72) / 2, w: Game.width() })
		.textFont({ family: 'Georgia', size: '72px' })
		.css({ 'color': 'white', 'text-align': 'center' });

	Crafty.load(['assets/images/player.png', 'assets/images/world.png'], function() {
		Crafty.sprite(32, 32, 'assets/images/player.png', {
			sprite_player:	[0, 0]
		});
		
		Crafty.sprite(32, 32, 'assets/images/world.png', {
			sprite_wall: [0, 0],
			sprite_tree: [1, 0]
		});
		
		// Loading done. Launch game.
		Crafty.scene('MainMap');
	});
});

Crafty.scene('MainMap', function() {
	
	var self = this;
	this.player = Crafty.e('Player');		
	this.player.move(5, 5);
	this.game_objects = [this.player];
	Crafty.background('#d2ffa6');				
	
	// Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
			var obj = null;
			
			if (at_edge) {
				// Place a wall entity at the current tile
				obj = Crafty.e('Wall');				
			} else if (Math.random() < 0.06 && !isOccupied(x, y)) {
				obj = Crafty.e('Tree');				
			} else if (Math.random() < 0.01) {
				obj = Crafty.e('Transition');				
			}
			
			if (obj != null) {
				obj.move(x, y);
				this.game_objects.push(obj);				
			}
		}
	}	
	
	function isOccupied(x, y) {
		for (var i = 0; i < self.game_objects.length; i++) {
			var obj = self.game_objects[i];			
			if (obj.grid_x() == x && obj.grid_y() == y) {
				return true;
			}
		}
		
		return false;
	}
});