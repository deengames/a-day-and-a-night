// A door between two maps. When something touches it, it opens.
Crafty.c('Door', {
	init: function() {
		this.transitioned = false;
		this.isClosed = true;
		
		this.requires('Actor, Collision, Interactive');
		this.onInteract(function() { console.log('!'); this.open(); });
		
		this.onHit('Solid', function(data) {
			if (this.isClosed) {
				this.open();
			}
						
			this.attr({ alpha: 0 });
			
			if (!this.transitioned) {
				var overlap = Math.abs(data[0].overlap);
				var hit = data[0].obj;
				// Magic number 11: sufficiently overlap the door.
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
	},
	
	open: function() {
		this.isClosed = false;
		Crafty.audio.play('openDoor');		
	}
});
