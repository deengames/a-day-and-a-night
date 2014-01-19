Game = {
	// This defines our grid's size and the size of each of its tiles
	width: 800,
	height: 608,
	
	mapGrid: {
		width:  25,
		height: 19,
		tile: {
			width:  32,
			height: 32
		}
	},
	
	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return this.mapGrid.width * this.mapGrid.tile.width;
	},
	
	// The total height of the game screen. Since our grid takes up the entire screen
	//  this is just the height of a tile times the height of the grid
	height: function() {
		return this.mapGrid.height * this.mapGrid.tile.height;
	},
	// Initialize and start our game
	start: function() {
		// Disable scrolling so people can't scroll the browser screen with arrows.
		// This is annoying in production.
		window.addEventListener("keydown", function(e) {
			// space and arrow keys
			if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);

		
		// Start the game
		Crafty.init(Game.width(), Game.height());		
		Crafty.scene('SplashScreen');		
	}
}