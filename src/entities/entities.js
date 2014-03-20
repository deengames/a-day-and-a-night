// A door between two maps.
Crafty.c('Door', {
	init: function() {
		this.transitioned = false;
		this.requires('Actor, Collision, indoor_door');
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
				// Stop, don't keep colliding.
				// But, noHit will trigger rapidly; wait.
				this.oldVelocity = this.velocity;
				this.velocity = { x: 0, y: 0 };
			} else {
				this.velocity.x *= -1;
				this.velocity.y *= -1;
			}
			
		});
		
		this.bind('EnterFrame', function() {
			// noHit keeps triggering after we stop; we can't reset v.
			// Easy way out: wait and make sure we're ~3 tiles away ...
			if (this.velocity.x == 0 && this.velocity.y == 0) {
				var player = Crafty('Player');
				var d = Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2);
				// 9 = 3^2 (three tiles away)
				if (typeof(this.oldVelocity) != 'undefined' && d >= 3 * 3 * Game.currentMap.tile.width * Game.currentMap.tile.height) {
					this.velocity = this.oldVelocity;
					this.resumeAnimation();
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

Crafty.c('DialogBox', {	
	
	init: function() {		
		this.requires('2D, Canvas, Image, Text')			
			.image(gameUrl + '/assets/images/message-window.png')
			.attr({
				z: 999,
				// Initialized here? w/h values are not set, sadly.
				// Hence, hard-coding. Sorry, old bean.		
				w: Game.view.width, h: Game.view.height / 4
			});
			
		this.text = Crafty.e('2D, DOM, Text')			
			.textFont({size: '24px'})
			.textColor('FFFFFF')
			.attr({ w: Game.view.width - 32, z: 999 });
		
		this.avatar = Crafty.e('2D, Canvas, Image')
			.attr({
				x: 11, y: 11, alpha: 0, z: this.z + 1,
				w: 128, h: 128 ////////// hard-coded
			})
		
		this.reposition();
		
		// Stay within the viewport. This fails on really small maps.			
		this.bind('ViewportScroll', function() {
			this.reposition()
		});
		
		this.bind('KeyDown', function(e) {
			if (typeof(closeNextKeyPress) != 'undefined' && e.key == Crafty.keys.SPACE) {
				this.close();
                delete this;
            }
		});
		
		this.bind('EnterFrame', function() {
			// 6 tiles squared
			var limit = 6 * 6 * Game.currentMap.tile.width * Game.currentMap.tile.height;
			if (this.source != null) {
				var dSquared = Math.pow(this.source.x - player.x, 2) + Math.pow(this.source.y - player.y, 2);								
				if (dSquared >= limit) {					
					this.close();
                    delete closeNextKeyPress;
				}
			}
		});
	},
	
	message: function(obj) {
		var self = this;
		delete closeNextKeyPress;
		// Only these types of messages are acceptable here:
		// 1) 	String (eg. "Hi mom!")
		// 2) 	Object. It can have an avatar (eg. { avatar: '/images/player.png', message: 'Lick my face?!' },
		// 			and a choice object (eg. { choices: ['Yes', 'No'], responses: ['Me too!', 'Oh, really? I disagree.'] }
		// 3) 	Array of any combination and number of the above
		if (typeof(obj) == 'string') {
			this.text.text(obj);
			this.avatar.attr({ alpha: 0 });
		} else { // object
			if (typeof(obj.avatar) != 'undefined') {
				this.avatar.attr({ alpha: 1 });
				this.avatar.image(obj.avatar);
			}
			
			if (typeof(obj.choices) != 'undefined') {
                awaitingChoice = true;
				// Freeze when making choices
				player.freeze();
				var choices = obj.choices;
				var responses = obj.responses;
				if (choices.length != responses.length) {
					throw new Error("Choices and responses should be equal in number; got " + choices.length + " choices and " + responses.length + " responses.");
				}
				
				var choiceBox = Crafty.e('2D, Canvas, Image')
					.image(gameUrl + '/assets/images/choice-box.png')
					.attr({ x: (Game.view.width - 200) / 2, y: Game.view.height / 4, z: this.z + 1 });
				
				// TODO: less hacks, more codez.
				// At 24px, each line is 17px high, plus 11px space
				// With Y offset of 11, there are 21px above the first line
				// Assuming window is at X, the choices are from:
				// 1) 22-37
				// 2) 49-64
				// n) 21 + 28n
				// Or we could, you know, create one text per item. :)
				var choiceText = Crafty.e('2D, DOM, Text')
					.textFont({size: '24px'})
					.textColor('FFFFFF')
					.text(choices.join('<br />'))
					.attr({x: choiceBox.x + 11, y: choiceBox.y + 11, z: choiceBox.z + 2})
					.attr({w: choiceBox.w - 32, h: choiceBox.h - 32 });
					
				// Fix issue where you pressing space to show the choices, and
				// the first choice is automatically picked.
				var chose = false; 
				
				var selectionBox = Crafty.e('2D, Canvas, Color')
					.color('rgb(192, 225, 255)')
					// 26, not 24, because we pad by 2px.
					// Other places, 28, pad by 4 (2 + 2)
					.attr({x: choiceText.x - 2, y: choiceText.y, z: choiceText.z - 1 })
					.attr({w: choiceText.w + 4, h: 26 })
					.bind('KeyUp', function(e) {												
						if (e.key == Crafty.keys.UP_ARROW && selectionBox.y > choiceText.y) {
							selectionBox.y -= 28;							
						} else if (e.key == Crafty.keys.DOWN_ARROW && selectionBox.y + 26 <= choiceText.y + 21 + (28 * (choices.length - 1))) {
							selectionBox.y += 28;							
						} else if (e.key == Crafty.keys.SPACE) {					
							if (chose) {								
								var n = Math.floor((selectionBox.y - choiceBox.y) / 26);
								var decided = choices[n];

								player.unfreeze();
								choiceBox.destroy();
								choiceText.destroy();
								selectionBox.destroy();
								
								self.message(responses[n]);
								self.closeNextKeyPress = true;
                                delete awaitingChoice;
							} else { 
								chose = true;								
							}
						}
					});		
			}
			this.text.text(obj.text);									
		}
		this.alpha = 1;
		this.reposition(this.x, this.y);
	},
	
	setSource: function(npc, x, y) {
		// Changed conversations, maybe in the middle ...
		if (this.source != null && this.source.npc != npc) {
			delete conversationIndex;
		}
		this.source = { npc: npc, x: x, y: y };
	},
	
	reposition: function() {
		if (this.alpha == 1) {
			var x = -Crafty.viewport.x;
			var y = -Crafty.viewport.y;
			
			// Don't go off the screen (top/left)
			x = Math.max(0, x);
			y = Math.max(0, y);
			
			// Don't go off the screen (bottom/right)			
			x = Math.min(Game.width() - this.w, x);			
			y = Math.min(Game.height() - this.h - (Game.view.height - this.h), y);

			this.x = x;
			this.y = Game.view.height - this.h + y;
						
			this.text.x = this.x + 11;
			this.text.y = this.y + 11;
			this.text.w = this.w - 32;
			
			if (this.avatar.alpha > 0) {
				this.text.x += (this.avatar.w + 11);
				this.text.w -= (this.avatar.w + 11);
			}
			
			this.avatar.x = this.x + 11;
			this.avatar.y = this.y + 11;
		}
	},
	
	close: function() {
		this.text.text('');
		this.alpha = 0;
		this.avatar.alpha = 0;
		this.source = null;		
		// If it was a conversation, forget the conversation
		delete conversationIndex;        
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
