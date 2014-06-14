// Contains animation and collision detection (bounces off solid objects).
Crafty.c('StandingNpc', {	
	init: function() {
		var animationDuration = 600; //ms
		var npc = this;
		
		this.checkCollisions = true;
		
		this.requires('Actor, SpriteAnimation, Solid, Collision, Interactive, default_sprite')
			.reel('MovingDown', animationDuration, getFramesForRow(0))
			.reel('MovingLeft', animationDuration, getFramesForRow(1))
			.reel('MovingRight', animationDuration, getFramesForRow(2))
			.reel('MovingUp', animationDuration, getFramesForRow(3));
				
		this.velocity = { x: 0, y: 0 };		
		
		this.onInteract(this.talk);
		
		this.onHit('Solid', function(data) {
			if (this.checkCollisions == true) {
				var target = data[0];
				if (target != null) {
					if (target.normal != null) {
						if (this.velocity.x != 0) {
							this.x -= target.normal.x * target.overlap;
						}
						
						if (this.velocity.y != 0) {
							this.y -= target.normal.y * target.overlap;
						}
					} else {
						this.x = this.lastPosition.x;
						this.y = this.lastPosition.y;
					}
				}
				
				// Stop if we hit the player.
				// Otherwise, just turn around.
				var bumpedIntoWalker = null;
				for (var i = 0; i < data.length; i++) {
					var bumpedInto = data[i];
					if (bumpedInto.obj.has('Player') || bumpedInto.obj.has('NpcBase')) {
						bumpedIntoWalker = bumpedInto;
						break;
					}
				}
				
				if (bumpedIntoWalker != null) {
					this.pauseAnimation();
					// Stop, don't keep colliding.
					// But, noHit will trigger rapidly; wait.
					if (this.velocity.x != 0 || this.velocity.y != 0) {
						this.oldVelocity = this.velocity;
						this.velocity = { x: 0, y: 0 };
						var timer = Crafty.e('Timer')
							.interval(1000)
							.callback(function() {
								var target = bumpedIntoWalker.obj;
								var d = Math.pow(npc.x - target.x, 2) + Math.pow(npc.y - target.y, 2);
								// 9 = 3^2 (three tiles away)
								if (typeof(npc.oldVelocity) != 'undefined' && d >= 3 * 3 * Game.currentMap.tile.width * Game.currentMap.tile.height) {
									npc.velocity = npc.oldVelocity;
									if (npc.state == 'moving') {
										npc.resumeAnimation();								
									}
									timer.stop();
									delete timer;
								}
							}).start();
					}
				} else {
					this.velocity.x *= -1;
					this.velocity.y *= -1;
				}
			}
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
		if (typeof(dialog) != 'undefined' && dialog != null && dialog.source != null && dialog.source.npc == this) {			
			dialog.setSource(this, this.x, this.y);
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
	
	disableCollisionCheck: function() {
		this.checkCollisions = false;
	},
	
	talk: function() {	
		var obj = null;		
		
		// Do we have a message?
		if (this.onTalk != null || this.messages.length > 0) {
			// Initialize dialog.
			// If there's no dialog, or multiple messages, do this.			
			if (typeof(dialog) == 'undefined' || this.messages.length > 0) {
					
				if (typeof(dialog) == 'undefined') {
					// no "var" keyword => global scope
					dialog = Crafty.e('DialogBox');				
				}
				
				if (this.onTalk != null) {
					obj = this.onTalk();
				} else {
					obj = this.messages;
				}
				
				dialog.setSource(this, this.x, this.y);
				dialog.message(obj);				
			} else {
				dialog.close();
                delete dialog;
			}
		}
	}
});

// Walks continuously (non-stop). "Bounces" off solid objects (turns around).
Crafty.c('WalkingNpc', {	
	init: function(sprite) {
		this.requires('StandingNpc, ' + sprite);
		this.bind('EnterFrame', this.moveOnVelocity);
	}
});

// Normal, default NPC. Walks with breaks in the middle.
Crafty.c('Npc', {
	init: function(sprite) {
		this.requires('StandingNpc, ' + sprite);
		this.bind('EnterFrame', this.moveDiscretely);
		this.stateStart = new Date().getTime() / 1000;
		this.state = 'moving'; // 'moving' or 'waiting'
		this.randomOffset = 2 * Math.random();
		
		// 32 is a good "slow"; 64 is normal; 100 is pretty fast.
		this.movementSpeed = 64;
	},
	
	moveDiscretely: function(data) {
		// First, change state if necessary
		var now = new Date().getTime() / 1000;
		var stateTime = now - this.stateStart;
		if (stateTime >= 1 + this.randomOffset && this.state == 'moving') {
			this.state = 'waiting';
			this.pauseAnimation();
			this.stateStart = now;
			
			this.velocity.x = 0;
			this.velocity.y = 0;
		} else if (stateTime >= 3 + this.randomOffset && this.state == 'waiting') {
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

function getFramesForRow(rowY) {
	// Walk cycle with three frames, but four steps.
	toReturn = [];
	toReturn.push([0, rowY]);
	toReturn.push([1, rowY]);
	toReturn.push([2, rowY]);
	toReturn.push([1, rowY]);
	return toReturn;
}
