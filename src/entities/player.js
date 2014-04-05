// This is the player-controlled character
Crafty.c('Player', {
	init: function() {
		player = this; // global variable
		this.frozen = false;
		var animationDuration = 480; //ms		
		
		this.requires('Actor, Color, MoveAndCollide, sprite_player, SpriteAnimation, Solid')
			.fourway(4) // Use an even whole number so we can pass pixel-perfect narrow passages
			.color('rgba(0, 0, 0, 0)')		
			.stopOnSolids()
			.collision([0, this.h / 2], [this.w, this.h / 2], [this.w, this.h],  [0, this.h])
			
			// Four animations (one per direction). X, Y, frames (excluding first frame)
			.reel('MovingDown', animationDuration, getFramesForRow(0))
			.reel('MovingLeft', animationDuration, getFramesForRow(1))
			.reel('MovingRight', animationDuration, getFramesForRow(2))
			.reel('MovingUp', animationDuration, getFramesForRow(3));
		
		this.z = 100;		
		
		// Change direction: tap into event		
		this.bind('NewDirection', function(data) {			
			if (this.frozen == false) {
				if (data.x > 0) {
					this.animate('MovingRight', -1);
				} else if (data.x < 0) {
					this.animate('MovingLeft', -1);
				} else if (data.y > 0) {
					this.animate('MovingDown', -1);
				} else if (data.y < 0) {
					this.animate('MovingUp', -1);				
				} else {
					this.pauseAnimation();
				}
			}
		});
		
		this.bind('KeyDown', function(data) {
			if (data.key == Crafty.keys.ESC) {
				Game.pause();
			}
		});
	},
	
	freeze: function() {
		this.disableControl();
		this.pauseAnimation();
		this.frozen = true;
	},
	
	unfreeze: function() {
		this.enableControl();
		this.animate();
		this.frozen = false;
	}
});

function getFramesForRow(rowY) {
	// Walk cycle with three frames, but four steps.
	toReturn = [];
	toReturn.push([0, rowY]);
	toReturn.push([1, rowY]);
	toReturn.push([2, rowY]);
	toReturn.push([1, rowY]);
	return toReturn;
}
