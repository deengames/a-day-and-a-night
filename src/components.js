// The Grid component allows an element to be located
//	on a grid of tiles
Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.mapGrid.tile.width,
			h: Game.mapGrid.tile.height
		})
	},

	// Locate this entity at the given position on the grid
	move: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x / Game.mapGrid.tile.width, y: this.y / Game.mapGrid.tile.height }
		} else {
			this.attr({ x: x * Game.mapGrid.tile.width, y: y * Game.mapGrid.tile.height });
			return this;
		}
	},
	
	gridX: function() {
		return Math.floor(this.x / Game.mapGrid.tile.width);
	},
	
	gridY: function() {
		return Math.floor(this.y / Game.mapGrid.tile.height);
	}
});

// An "Actor" is an entity that is drawn in 2D on canvas
//	via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
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
	
	stopMovement: function() {
		if (this._movement) {
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
		this.radiusSquared = radius * radius * Game.mapGrid.tile.width * Game.mapGrid.tile.height;
		this.player = player;
		this.x = null;
		this.y = null;
		
		this.bind('EnterFrame', function() {
			if (this.audioId == null) {
				throw new Error("PositionalAudio created but init() was never called.");
			}
			
			if (this.obj != null && this.x != null && this.y != null) {
				// Avoid sqrt: a^2 + b^2 = c^2
				var dSquared = Math.pow(this.x - this.player.x, 2) + Math.pow(this.y - this.player.y, 2);
				// Map (0 .. d^2) to (1 .. 0)
				var volume = Math.max(0, this.radiusSquared - dSquared) / this.radiusSquared;
				this.setVolume(volume);
			} else {			
				for (var i = 0; i < Crafty.audio.channels.length; i++) {
					var c = Crafty.audio.channels[i];
					if (c.id == this.audioId) {					
						this.obj = c.obj;						
					}
				}
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






//////////////////////////////////////////////////////////////////////////////////////






/**@
 * #Multiway
 * @category Input
 * Used to bind keys to directions and have the entity move accordingly
 * @trigger NewDirection - triggered when direction changes - { x:Number, y:Number } - New direction
 * @trigger Moved - triggered on movement on either x or y axis. If the entity has moved on both axes for diagonal movement the event is triggered twice - { x:Number, y:Number } - Old position
 */
Crafty.c("Multiway", {
    _speed: 3,

    _keydown: function (e) {		
        if (this._keys[e.key]) {
            this._movement.x = Math.round((this._movement.x + this._keys[e.key].x) * 1000) / 1000;
            this._movement.y = Math.round((this._movement.y + this._keys[e.key].y) * 1000) / 1000;
            this.trigger('NewDirection', this._movement);
			console.log('KEYDOWN: new direction: ' + this._movement.x + ", " + this._movement.y);
        }
    },

    _keyup: function (e) {
        if (this._keys[e.key]) {
            this._movement.x = Math.round((this._movement.x - this._keys[e.key].x) * 1000) / 1000;
            this._movement.y = Math.round((this._movement.y - this._keys[e.key].y) * 1000) / 1000;
            this.trigger('NewDirection', this._movement);
			console.log('KEYUP: new direction: ' + this._movement.x + ", " + this._movement.y);
        }
    },

    _enterframe: function () {
        if (this.disableControls) return;

        if (this._movement.x !== 0) {
            this.x += this._movement.x;
            this.trigger('Moved', {
                x: this.x - this._movement.x,
                y: this.y
            });
        }
        if (this._movement.y !== 0) {
            this.y += this._movement.y;
            this.trigger('Moved', {
                x: this.x,
                y: this.y - this._movement.y
            });
        }
    },

    _initializeControl: function () {		
        return this.unbind("KeyDown", this._keydown)
            .unbind("KeyUp", this._keyup)
            .unbind("EnterFrame", this._enterframe)
            .bind("KeyDown", this._keydown)			
            .bind("KeyUp", this._keyup)
            .bind("EnterFrame", this._enterframe)
			.bind("CraftyBlur", this._blur);
    },
	
	_blur: function() {		
		// Tell all the keys they're no longer held down
		for (var k in Crafty.keys) {
            if (Crafty.keydown[Crafty.keys[k]]) {
                this.trigger("KeyUp", {
                    key: Crafty.keys[k]
                });
			}
		}
		Crafty.keydown = [];
		
		// Stop moving
		this._movement = {x: 0, y: 0};
				
		// Trigger direction change event
		this.trigger('NewDirection', this._movement);		
	},

    /**@
     * #.multiway
     * @comp Multiway
     * @sign public this .multiway([Number speed,] Object keyBindings )
     * @param speed - Amount of pixels to move the entity whilst a key is down
     * @param keyBindings - What keys should make the entity go in which direction. Direction is specified in degrees
     * Constructor to initialize the speed and keyBindings. Component will listen to key events and move the entity appropriately.
     *
     * When direction changes a NewDirection event is triggered with an object detailing the new direction: {x: x_movement, y: y_movement}
     * When entity has moved on either x- or y-axis a Moved event is triggered with an object specifying the old position {x: old_x, y: old_y}
     *
     * @example
     * ~~~
     * this.multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
     * this.multiway({x:3,y:1.5}, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
     * this.multiway({W: -90, S: 90, D: 0, A: 180});
     * ~~~
     */
    multiway: function (speed, keys) {
        this._keyDirection = {};
        this._keys = {};
        this._movement = {
            x: 0,
            y: 0
        };
        this._speed = {
            x: 3,
            y: 3
        };

        if (keys) {
            if (speed.x !== undefined && speed.y !== undefined) {
                this._speed.x = speed.x;
                this._speed.y = speed.y;
            } else {
                this._speed.x = speed;
                this._speed.y = speed;
            }
        } else {
            keys = speed;
        }

        this._keyDirection = keys;
        this.speed(this._speed);

        this._initializeControl();

        //Apply movement if key is down when created
        for (var k in keys) {
            if (Crafty.keydown[Crafty.keys[k]]) {
                this.trigger("KeyDown", {
                    key: Crafty.keys[k]
                });
            }
        }

        return this;
    },

    /**@
     * #.enableControl
     * @comp Multiway
     * @sign public this .enableControl()
     *
     * Enable the component to listen to key events.
     *
     * @example
     * ~~~
     * this.enableControl();
     * ~~~
     */
    enableControl: function () {
        this.disableControls = false;
        return this;
    },

    /**@
     * #.disableControl
     * @comp Multiway
     * @sign public this .disableControl()
     *
     * Disable the component to listen to key events.
     *
     * @example
     * ~~~
     * this.disableControl();
     * ~~~
     */

    disableControl: function () {
        this.disableControls = true;
        return this;
    },

    /**@
     * #.speed
     * @comp Multiway
     * @sign public this .speed(Number speed)
     * @param speed - The speed the entity has.
     *
     * Change the speed that the entity moves with.
     *
     * @example
     * ~~~
     * this.speed(2);
     * ~~~
     */
    speed: function (speed) {
        for (var k in this._keyDirection) {
            var keyCode = Crafty.keys[k] || k;
            this._keys[keyCode] = {
                x: Math.round(Math.cos(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.x) / 1000,
                y: Math.round(Math.sin(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.y) / 1000
            };
        }
        return this;
    }
});