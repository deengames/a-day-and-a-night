// The Grid component allows an element to be located
//	on a grid of tiles
Crafty.c('Grid', {
	size: function(width, height) {
		this.attr({
			width: width,
			height: height
		})
	},
	
	// Locate this entity at the given position on the grid
	move: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x / this.width, y: this.y / this.height }
		} else {
			this.attr({ x: x * this.width, y: y * this.height });
			return this;
		}
	},
	
	gridX: function() {
		return Math.floor(this.x / this.width);
	},
	
	gridY: function() {
		return Math.floor(this.y / this.height);
	}
});

// An "Actor" is an entity that is drawn in 2D on canvas
//	via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	}
});

// Handy movement helper that slides instead of dead stops when bumping against other solids
// Warning: depends on internal implementation details (_movement). 
// This may break when you update CraftyJS.
Crafty.c('MoveAndCollide', {
	init: function() {
		this.requires('Fourway, Collision')
	},
	
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);
		return this;
	},
	
	stopMovement: function(data) {
		var overlap = data[0].overlap;
		// null: MBR collision. It's solid.
		// 1.5: prevent getting stuck in collisions.
		var overlaps = (overlap == null || Math.abs(overlap) >= 1.5);
		if (this._movement && overlaps) {
			this.x -= this._movement.x;
			if (this.hit('Solid') != false) {
				this.x += this._movement.x;
				this.y -= this._movement.y;
				if (this.hit('Solid') != false) {
					this.x -= this._movement.x;					
				}
			}
		} else {
			this._speed = 0;
		}
	}
});

Crafty.c('Interactive', {

	onInteract: function(func) {
		this.interactFunction = func;
	},
	
	interact: function() {
		if (this.interactFunction != null) {
			this.interactFunction();
		}
	},
	
	talk: function() {	
		var obj = null;		
		
		// Do we have a message?
		if (this.onTalk != null || this.messages.length > 0) {
			// Initialize dialog.
			if (typeof(dialog) == 'undefined') {
				// no "var" keyword => global scope
				dialog = Crafty.e('DialogBox');
			}
			
			if (this.onTalk != null) {
				obj = this.onTalk();
			} else {
				obj = this.messages[Math.floor(Math.random() * this.messages.length)];
			}
			
			dialog.setSource(this, this.x, this.y);
			if (obj instanceof Array) {
				if (typeof(conversationIndex) == 'undefined') {
					conversationIndex = 0;
				} else {
					conversationIndex += 1;
					if (conversationIndex >= obj.length) {
						dialog.close();						
						return;
					}
				}
				
				message = obj[conversationIndex];
			} else {
				message = obj;
			}
						
			dialog.message(message);
		}
	}
});

Crafty.c('PositionalAudio', {

	// AudioID: from Crafty.audio.add
	PositionalAudio: function(audioId, radius, player) {		
		this.requires('Actor');
		
		this.audioId = audioId;
		// Use pixels, not tiles, so we get smoother transitions.
		// To replace with tiles, remove the * width * height here, and change
		// all instances of x/y to gridX/gridY in the d^2 calculation.
		this.radiusSquared = radius * radius * this.width * this.height;
		this.player = player;
		
		this.bind('EnterFrame', function() {
			if (this.audioId == null) {
				throw new Error("PositionalAudio created but init() was never called.");
			}
			
			if (this.obj != null && this.x != null && this.y != null) {
				// Avoid sqrt: a^2 + b^2 = c^2
				var dSquared = Math.pow(this.x - this.player.x, 2) + Math.pow(this.y - this.player.y, 2);
				// Map (0 .. r^2) to (1 .. 0)
				var volume = Math.max(0, this.radiusSquared - dSquared) / this.radiusSquared;
				this.setVolume(volume);
			} else {			
				for (var i = 0; i < Crafty.audio.channels.length; i++) {
					var c = Crafty.audio.channels[i];
					if (c.id == this.audioId) {					
						this.obj = c.obj;						
					}
				}
				
				if (this.obj == null) {
					throw new Error("Couldn't find audio for " + audioId);
				}
			}			
		});
		
		this.bind('Remove', function() {
			if (this.audioId != null) {
				Crafty.audio.stop(this.audioId);				
			}
		});
	},
	
	play: function() {
		Crafty.audio.play(this.audioId, -1);
	},
	
	setVolume: function(volume) {
		this.obj.volume = volume;
	}
});
