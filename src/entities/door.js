// A door between two maps.
Crafty.c('Door', {
	init: function() {
		this.transitioned = false;
		this.requires('Actor, Collision');
		this.onHit('Solid', function(data) {
			if (!this.transitioned) {
				var overlap = Math.abs(data[0].overlap);
				var hit = data[0].obj;
				// Magic number 11: sufficiently overlap the door.
				// TODO: remove this when the player collision rect
				// is only the bottom half of him.
				if (hit.has('Player') && Math.abs(overlap) >= 11) {
					var self = this;
					Game.player.freeze();
					if (typeof(dialog) != 'undefined') {
						dialog.close();
					}					
					this.transitioned = true; // Don't register more than once
					Game.fadeOut();
					window.setTimeout(function() {						
						Game.showMap(self.destination);						
						Game.player.move(self.destinationX, self.destinationY);
						Game.player.unfreeze();
					}, 1000);					
				}
			}
		});
	},
	
	transitionsTo: function(destination, x, y) {
		// ToDo: test validation
		if (destination == null) {
			throw new Error("Must specify a door destination.");
		} else if (x == null) {
			throw new Error("Must specify a door x coordinate.");
		} else if (y == null) {
			throw new Error("Must specify a door y coordinate.");
		}
		
		this.destination = destination;
		this.destinationX = x;
		this.destinationY = y;
	}
});
