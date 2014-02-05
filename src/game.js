Game = {
	// This defines our grid's size and the size of each of its tiles
	view: {
		width: 800,
		height: 600
	},
	
	currentMap: null,

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
		if (debug != null && debug == true) {
			Crafty.scene('Loading');
		} else {
			Crafty.scene('SplashScreen');		
		}
	},
	
	width: function() {
		return this.currentMap.width * this.currentMap.tile.width;
	},
	
	height: function() {
		return this.currentMap.height * this.currentMap.tile.height;
	}
}