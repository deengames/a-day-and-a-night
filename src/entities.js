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

// Don't use this. It's an "internal" entity.
Crafty.c('NpcBase', {
	init: function() {
		var animationDuration = 600; //ms	
		
		this.requires('Actor, Color, sprite_npc1, SpriteAnimation, Solid, Collision, Interactive')
			.color('none')			
			.reel('MovingDown', animationDuration, getFramesForRow(0))
			.reel('MovingLeft', animationDuration, getFramesForRow(1))
			.reel('MovingRight', animationDuration, getFramesForRow(2))
			.reel('MovingUp', animationDuration, getFramesForRow(3));
				
		this.velocity = { x: 0, y: 0 };
		
		this.onHit('Solid', function(data) {
			this.x = this.lastX;
			this.y = this.lastY
			
			this.velocity.x *= -1;
			this.velocity.y *= -1;
		}, function() {
			this.resumeAnimation();
		});
	},
	
	setVelocity: function(x, y) {
		this.velocity.x = x;
		this.velocity.y = y;
	},
	
	moveToTarget: function(data) {
		// Keep the last frame's (x, y) for moving back on a collision
		this.lastX = this.x;
		this.lastY = this.y;		
		
		var elapsedMs = data.dt / 1000.0;
		var xMove = this.velocity.x * elapsedMs;
		var yMove = this.velocity.y * elapsedMs;
		
		this.x += xMove;
		this.y += yMove;
		if (this.text != null) {
			this.text.x += xMove;
			this.text.y += yMove;
		}
		
		// Possible direction change
		if (this.lastVelocity == null || this.lastVelocity.x != this.velocity.x || this.lastVelocity.y != this.velocity.y) {
			// TODO: we can use the greater magnitude to determine the animation
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
	},
	
	talk: function(message) {
		
		if (this.text == null) {
			this.text = Crafty.e('2D, Canvas, Text, Tween');
		} else {
			this.text.alpha = 1.0;
		}
		
		this.text
			.text(message)
			.attr({ x: this.x, y: this.y - 16 })
			.textFont({size: '16px'})			
			.tween({ alpha: 0.0 }, 5000);
	}
});

Crafty.c('WalkingNpc', {
	init: function() {
		this.requires('NpcBase, sprite_npc1');
		this.bind('EnterFrame', this.moveToTarget);
	}
});

// Normal, default NPC. Walks slowly.
Crafty.c('Npc', {
	init: function() {
		this.requires('NpcBase, sprite_npc2');
		this.bind('EnterFrame', this.moveDiscretely);
		this.stateStart = new Date().getTime() / 1000;
		this.state = 'moving'; // 'moving' or 'waiting'
		
		// 32 is a good "slow"; 64 is normal; 100 is pretty fast.
		this.movementSpeed = 64;
	},
	
	moveDiscretely: function(data) {
		// First, change state if necessary
		var now = new Date().getTime() / 1000;
		var stateTime = now - this.stateStart;
		if (stateTime >= 1 && this.state == 'moving') {
				this.state = 'waiting';
				this.pauseAnimation();
				this.stateStart = now;
				
				this.velocity.x = 0;
				this.velocity.y = 0;
		} else if (stateTime >= 3 && this.state == 'waiting') {
				this.state = 'moving';
				this.resumeAnimation();
				this.stateStart = now;
				
				// Pick direction. 0=up, 1=right, 2=down, 3=left
				var dir = Math.floor(Math.random() * 4);
				if (dir % 2 == 0) {
					// up or down
					this.velocity.y = this.movementSpeed * (dir == 0 ? -1 : 1);
					this.velocity.x = 0;
				} else {
					// left or right
					this.velocity.x = this.movementSpeed * (dir == 3 ? -1 : 1);
					this.velocity.y = 0;
				}
		}
		
		if (this.state == 'moving') {
			this.moveToTarget(data);
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