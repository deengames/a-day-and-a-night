Game = {
	// This defines our grid's size and the size of each of its tiles
	view: {
		width: 800,
		height: 600
	},
	
	mapGrid: {
		width:  50,
		height: 40,
		tile: {
			width:  32,
			height: 32
		}
	},

	// Initialize and start our game
	start: function() {
		// Disable scrolling so people can't scroll the browser screen with arrows.
		// This is annoying, but works well in production.
		window.addEventListener("keydown", function(e) {
			// space and arrow keys
			if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);
		
		// Start the game
		Crafty.init(Game.view.width, Game.view.height);		
		Crafty.scene('SplashScreen');		
	},
	
	width: function() {
		return this.mapGrid.width * this.mapGrid.tile.width;
	},
	
	height: function() {
		return this.mapGrid.height * this.mapGrid.tile.height;
	}
}