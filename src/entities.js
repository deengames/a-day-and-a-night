// A door between two maps.
Crafty.c('Door', {
	init: function() {
		this.transitioned = false;
		this.requires('Actor, Collision, indoor_door');
		this.onHit('Solid', function(data) {
			if (!this.transitioned) {
				var overlap = Math.abs(data[0].overlap);
				var hit = data[0].obj;
				if (hit.has('Player') && Math.abs(overlap) >= 16) {
					console.debug("Transitioning to " + this.destination);
					Game.showMap(this.destination);
					Game.player.move(this.destinationX, this.destinationY);
					this.transitioned = true;
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

// Don't use this. It's an "internal" entity.
// Contains animation and collision detection (bounces off solid objects).
Crafty.c('NpcBase', {	
	init: function() {
		var animationDuration = 600; //ms
		
		this.requires('Actor, SpriteAnimation, Solid, Collision, Interactive, default_sprite')
			.reel('MovingDown', animationDuration, getFramesForRow(0))
			.reel('MovingLeft', animationDuration, getFramesForRow(1))
			.reel('MovingRight', animationDuration, getFramesForRow(2))
			.reel('MovingUp', animationDuration, getFramesForRow(3));
				
		this.velocity = { x: 0, y: 0 };
		this.lastPosition = { x: this.x, y: this.y };
		
		this.onInteract(this.talk);
		
		this.onHit('Solid', function(data) {
			if (this.velocity.x != 0) {
				this.x = this.lastPosition.x;
			}
			
			if (this.velocity.y != 0) {
				this.y = this.lastPosition.y;
			}
			
			// Stop if we hit the player, or another entity.
			// Otherwise, just turn around.
			var bumpedPlayer = null;
			for (var i = 0; i < data.length; i++) {
				var bumpedInto = data[0];
				if (bumpedInto.obj.has('Player')) {
					bumpedPlayer = bumpedInto;
					break;
				}
			}
			
			if (bumpedPlayer != null) {
				this.pauseAnimation();
			} else {
				this.velocity.x *= -1;
				this.velocity.y *= -1;
			}
			
		}, function() {
			this.resumeAnimation();
		});
	},
	
	setVelocity: function(x, y) {
		this.velocity = {x: x, y: y };		
	},
	
	moveOnVelocity: function(data) {		
		// Keep the last frame's (x, y) for moving back on a collision
		this.lastPosition = { x: this.x, y: this.y };
		
		var elapsedMs = data.dt / 1000.0;
		var xMove = this.velocity.x * elapsedMs;
		var yMove = this.velocity.y * elapsedMs;
		
		this.x += xMove;
		this.y += yMove;
		if (this.text != null) {
			this.text.x = this.x;
			this.text.y = this.y - 16;
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
	
	talk: function() {	
		var message = '';		
		
		if (this.onTalk != null) {
			message = this.onTalk();
		} else {
			message = this.messages[Math.floor(Math.random() * this.messages.length)];
		}
		
		if (typeof(dialog) == 'undefined') {
			// no "var" keyword => global scope
			dialog = Crafty.e('DialogBox');
		}
		
		dialog.message(message);
	}
});

// Walks continuously (non-stop). "Bounces" off solid objects (turns around).
Crafty.c('WalkingNpc', {	
	init: function(sprite) {
		this.requires('NpcBase, ' + sprite);
		this.bind('EnterFrame', this.moveOnVelocity);
	}
});

// Normal, default NPC. Walks with breaks in the middle.
Crafty.c('Npc', {
	init: function(sprite) {
		this.requires('NpcBase, ' + sprite);
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
			this.moveOnVelocity(data);
		}
	}
});

// This is the player-controlled character
Crafty.c('Player', {
	init: function() {

		var animationDuration = 480; //ms		
		
		this.requires('Actor, Color, MoveAndCollide, sprite_player, SpriteAnimation, Solid')
			.fourway(4) // Use an even whole number so we can pass pixel-perfect narrow passages
			.color('rgba(0, 0, 0, 0)')		
			.stopOnSolids()
			
			// Four animations (one per direction). X, Y, frames (excluding first frame)
			.reel('MovingDown', animationDuration, getFramesForRow(0))
			.reel('MovingLeft', animationDuration, getFramesForRow(1))
			.reel('MovingRight', animationDuration, getFramesForRow(2))
			.reel('MovingUp', animationDuration, getFramesForRow(3));
		
		this.z = 100;
		
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

Crafty.c('DialogBox', {
	init: function() {
		this.requires('2D, Canvas, Image, Text')			
			.image('assets/images/message-window.png')
			.attr({ x: 0, y: 450 })			
			
		this.text = Crafty.e('2D, Canvas, Text')
			.attr({x : 16, y: 450 + 16 })
			.textFont({size: '24px'})
			.textColor('FFFFFF');
	},
	
	message: function(message) {
		this.text.text(message);
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
