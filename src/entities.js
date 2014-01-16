// A Wall is a solid wall.
Crafty.c('Wall', {
	init: function() {
		this.requires('Actor, Color, Solid, sprite_wall')
			.color('none');
	}
});

// A tree is like a wall. But greener.
Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Color, Solid, sprite_tree')
			.color('none');
	}
});

Crafty.c('Npc', {
	init: function() {
		var animationDuration = 600; //ms	
		
		this.requires('Actor, Color, sprite_npc1, SpriteAnimation, Solid, Collision, Interactive')
			.color('none')			
			.reel('MovingDown', animationDuration, getFramesForRow(0))
			.reel('MovingLeft', animationDuration, getFramesForRow(1))
			.reel('MovingRight', animationDuration, getFramesForRow(2))
			.reel('MovingUp', animationDuration, getFramesForRow(3));
		
		this.bind('EnterFrame', this.moveToTarget);
		this.velocity = { x: 0, y: 100 };
		
		this.onHit('Solid', function(data) {
			this.x = this.lastX;
			this.y = this.lastY
			
			this.velocity.x *= -1;
			this.velocity.y *= -1;
		}, function() {
			this.resumeAnimation();
		});
	},
	
	moveToTarget: function(data) {
		// Keep the last (x, y) for moving back on a collision
		this.lastX = this.x;
		this.lastY = this.y;		
		
		var elapsedMs = data.dt / 1000.0;
		this.x += this.velocity.x * elapsedMs;
		this.y += this.velocity.y * elapsedMs;
		
		// Possible direction change
		if (this.lastVelocity == null || this.lastVelocity.x != this.velocity.x || this.lastVelocity.y != this.velocity.y) {
			// Big assumption: move in only one direction at a time
			if (this.velocity.x != 0) {
				this.animate(this.velocity.x < 0 ? 'MovingLeft' : 'MovingRight', -1);				
			} else if (this.velocity.y != 0) {
				this.animate(this.velocity.y < 0 ? 'MovingUp' : 'MovingDown', -1);				
			}
			
			if (this.lastVelocity == null) {
				this.lastVelocity = { x: 0, y: 0 };
			}
			
			this.lastVelocity.x = this.velocity.x;
			this.lastVelocity.y = this.velocity.y;
		}
	}
});

// This is the player-controlled character
Crafty.c('Player', {
	init: function() {
		var animationDuration = 400; //ms
		
		this.requires('Actor, Color, MoveAndCollide, sprite_player, SpriteAnimation, Solid')
			.fourway(4)			
			.color('none')
			.stopOnSolids()
			
			// Four animations (one per direction). X, Y, frames (excluding first frame)
			.reel('MovingDown', animationDuration, getFramesForRow(0))
			.reel('MovingLeft', animationDuration, getFramesForRow(1))
			.reel('MovingRight', animationDuration, getFramesForRow(2))
			.reel('MovingUp', animationDuration, getFramesForRow(3));
			
		// Change direction: tap into event		
		this.bind('NewDirection', function(data) {
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
		});
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