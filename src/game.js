Game = {	
	// This defines our grid's size and the size of each of its tiles
	view: {
		width: 800,
		height: 600
	},
	
	// Unfortunately, necessary for positioning, due to the life cycle
	// of different methods and when this gets populated for real.
	avatar: {
		width: 134,
		height: 134
	},

	// Initialize and start our game
	start: function() {		
		// Disable scrolling so people can't scroll the browser screen with arrows.
		// This is annoying, but works well in production.
		window.addEventListener("keydown", function(e) {
			// space and arrow keys
			if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);
		
		// Large maps (eg. 100x100 tiles) run at like 3 FPS. This is why: the
        // Crafty boundary checking iterates over all entities (O(n)).
        // We can turn off "clamp to entities" (which shows that black area
        // outside of maps), or we can try to do better, given that we have
        // a static map with entities inside only (not outside the map).
		// Crafty.viewport.clampToEntities = false;
        Crafty.map.boundaries = function() {
        
			// Special case: map is smaller than the screen, center appropriately.
			// Note: Game.currentMap is in tiles; Game.view is in pixels.
			if (Game.currentMap.width * 32 < Game.view.width && Game.currentMap.height * 32 <= Game.view.height) {
				var startX = ((Game.currentMap.width * 32) - Game.view.width) / 2;
				var startY = ((Game.currentMap.height * 32) - Game.view.height) / 2;				
				return {
					min: { x: startX, y: startY },
					max: { x: startX + Game.view.width, y: startY + Game.view.height }
				};
				
			} else {
				// Clamp lower-end at (0, 0)
				var startX = Math.max(-Crafty.viewport.x, 0);
				var startY = Math.max(-Crafty.viewport.y, 0);
							
				// Clamp upper-end at (map_width - screen_width, map_height - screen_height)
				startX = Math.min(startX, Game.width() - Game.view.width);
				startY = Math.min(startY, Game.height() - Game.view.height);
				
				var camera = { x: startX, y: startY };				
				return {
					min: { x: camera.x, y: camera.y },
					max: { x: camera.x + Game.view.width, y: camera.y + Game.view.height }
				};
			}
        };
		// Start the game
		Crafty.init(Game.view.width, Game.view.height);				
		Crafty.scene('Loading');
	},
	
	pause: function() {
		if (!Crafty.isPaused()) {
			this.showPauseScreen();
		} else {
			this.hidePauseScreen();
		}
				
		// Crafty pauses too fast. Draw first.
		Crafty.pause();		
	},
    
    showPauseScreen: function() {
        if (typeof(this.blackout) == 'undefined') {
            this.blackout = Crafty.e('Actor, Color')
                .color("black")
                .attr({w: Game.width(), h: Game.height(), z: 99999 });			
            
            this.pauseText = Crafty.e('Actor, Text')
                .textFont({size: '24px'})
                .textColor('FFFFFF')
                .attr({ z: 100000 });
        }
        
        this.pauseText.x = -Crafty.viewport.x + ((Game.view.width - 100) / 2);
        this.pauseText.y = -Crafty.viewport.y + 150;
        var self = this;
        
        this.inventoryIcon = Crafty.e('Actor, Image, Mouse')
            .image(gameUrl + '/assets/images/inventory-icon.png')
            .attr({ z: this.blackout.z + 1 });
            
        this.inventoryIcon.x = -Crafty.viewport.x + 100;
        this.inventoryIcon.y = -Crafty.viewport.y + Game.view.height - this.inventoryIcon.h - 100;
        this.inventoryIcon.bind('Click', function() {
            self.showInventory();
        });
        
        this.achievementsIcon = Crafty.e('Actor, Image, Mouse')
            .image(gameUrl + '/assets/images/achievements-icon.png')
            .attr({ z: this.blackout.z + 1 });
        this.achievementsIcon.x = -Crafty.viewport.x + Game.view.width - this.achievementsIcon.w - 100;
        this.achievementsIcon.y = -Crafty.viewport.y + Game.view.height - this.achievementsIcon.h - 100;
        this.achievementsIcon.bind('Click', function() {
            console.debug("Achievements coming soon.");
        });
        
        this.blackout.alpha = 0.5;
        this.pauseText.text(Crafty('PointsManager').totalPoints() + " points");
        Crafty.trigger("RenderScene")
    },
    
    hidePauseScreen: function() {
        this.blackout.alpha = 0;
        this.pauseText.text("");
        this.inventoryIcon.destroy();
        this.achievementsIcon.destroy();
        
        this.hideInventory();
   		Crafty.trigger("RenderScene");
    },
    
    showInventory: function() {
        this.pauseText.text("");
        this.inventoryIcon.attr({ alpha: 0 });
        this.achievementsIcon.attr({ alpha: 0 });
        
        Crafty('Player').inventory.show();
        Crafty.trigger("RenderScene");
    },
    
    hideInventory: function() {
        Crafty('Player').inventory.hide();
    },
	
	width: function() {
		// No map loaded? Okay. Lie.
		// Makes it easier to initialize fades, etc.
		if (this.currentMap != null) {
			return this.mapWidth * this.currentMap.tile.width;
		} else {
			return this.view.width;
		}
	},
	
	height: function() {
		if (this.currentMap != null) {
			return this.mapHeight * this.currentMap.tile.height;
		} else {
			return this.view.height;
		}
	},
	
	showMap: function(map) {		
		// Destroy old stuff
		if (this.gameObjects != null) {
			for (var i = 0; i < this.gameObjects.length; i++) {
				var obj = this.gameObjects[i];
				obj.destroy();
			}
		}
		
		this.gameObjects = [];
		
		if (typeof(this.currentMap) != 'undefined') {
			Crafty.audio.stop(this.currentMap.audio);			
		}
				
		////////////// Maps are complicated. ////////////// 
		// If the map name is "worldMap":
		// worldMap.tiles:		(optional) objp/object tiles are contained here.
		// worldMap.tileset:	(optional) Tileset data (eg. which tiles are solid)
		// worldMap.js:			Any additional stuff we write in codez
		//					    eg. background, audio, perimeter, NPCs				
		this.currentMap = eval(map + "()");		
		this.currentMap.fileName = map;        
        
        var isTilesFile = true;
        
        try {
            var tileData = eval(map + "_tiles()");
        } catch (err) {
            isTilesFile = false;
            console.debug("Failed to load _tiles.js file (function call failed:" + err);            
        }
		
        var isTilesetFile = true;
        
        try {
            var tileset = eval(map + "_tileset()");
        } catch (err) {
            isTilesetFile = false;
            console.debug("Failed to load _tileset.js file (function call failed:" + err);
        }
        
        if (isTilesetFile == true) {
            ////////////////// Start processing the tileset file
            // Create tileset dynamically. D'oh. With eval, because we need
            // an object, not a hash, for CraftyJS.
            tileset_map = "tileset_map = { "
            var i = 0;
            for (var y = 0; y < tileset.height; y++) {
                for (var x = 0; x < tileset.width; x++) {
                    tileset_map += "tile_" + i + ": [" + x + ", " + y + "]";
                    if (x < tileset.width - 1 || y < tileset.height - 1) {
                        tileset_map += ", ";
                    }
                    i++;
                }
            }
            tileset_map += "};"
            tileset_map = eval(tileset_map);
            
            Crafty.sprite(32, tileset.tilesets[0], tileset_map);
		}
		
		// Technically, neither is required. If the Tiled JSON map exists,
		// it will be the correct one; the other one is for simple cases.		
		this.mapWidth = tileData.width || this.currentMap.width;
		this.mapHeight = tileData.height || this.currentMap.height;       
        var tiles = tileData.tiles;
        
        if (isTilesFile == true) {
            ////////////////// Start processing the tiles file        
            var playerZ = Crafty('Player').z;
            
            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                var tileName = 'tile_' + (tile['tile'] - 1);
                var def = 'Actor, Sprite, ' + tileName;
                if (tileset.solid.indexOf(tile['tile']) !== -1) {
                    def += ", Solid";
                }
                
                var e = Crafty.e(def).attr({ x: tile['x'] * 32, y: tile['y'] * 32, z: tile['z']});
                this.gameObjects.push(e);
            }
        }
        
        ////////////////// Start processing the .js map
		for (var y = 0; y < this.mapHeight; y++) {
			for (var x = 0; x < this.mapWidth; x++) {
				var bg = Crafty.e('Actor, Canvas, ' + this.currentMap.background);
				bg.size(this.currentMap.tile.width, this.currentMap.tile.height);			
				bg.move(x, y);
				bg.z = -1;
				this.gameObjects.push(bg);				
			}
		}
		
		if (this.fade == null) {
			this.fade = Crafty.e('Actor, Color, Tween')
				.attr({w: Game.width(), h: Game.height(), z: 99999 })
				.color('black');			
		}

		this.fade.alpha = 1.0;
		this.fade.tween({alpha: 0.0}, 1000);		
			
		if (this.currentMap.perimeter != null) {
			var entityName = 'Actor, Solid, ' + this.currentMap.perimeter;
			
			// Top and bottom
			for (var x = 0; x < this.mapWidth; x++) {
				var e = Crafty.e(entityName);
				// They're all the same, so check the first one only.
				if (e.has('Grid') == false) {
					throw new Error("Can't create entity of type " + entityName + " for map perimeter. Check the name is correct.");
				}				
				e.size(this.currentMap.tile.width, this.currentMap.tile.height);
				e.move(x, 0);
				this.gameObjects.push(e);
				
				e = Crafty.e(entityName);
				e.size(this.currentMap.tile.width, this.currentMap.tile.height);
				e.move(x, this.mapHeight - 1);		
				this.gameObjects.push(e);
			}
			
			// Left and right
			for (var y = 0; y < this.mapHeight; y++) {
				var e = Crafty.e(entityName);
				e.size(this.currentMap.tile.width, this.currentMap.tile.height);
				e.move(0, y);
				this.gameObjects.push(e);
				
				e = Crafty.e(entityName);
				e.size(this.currentMap.tile.width, this.currentMap.tile.height);
				e.move(this.mapWidth - 1, y);
				this.gameObjects.push(e);
			}
		}
		
		for (var i = 0; i < this.currentMap.objects.length; i++) {
			var def = this.currentMap.objects[i];
			// TODO: strategy pattern will work well here
			var type = def.type;
			if (def.type == null) {
				throw new Error("Object without specified type found. Definition: " + def);
			} else {
				if (def.range != null) {
					for (var y = def.range.start.y; y <= def.range.end.y; y++) {
						for (var x = def.range.start.x; x <= def.range.end.x; x++) {
							def.x = x;
							def.y = y;							
							this.createObjectFrom(def, this.player);						
						}
					}
				} else {
					this.createObjectFrom(def, this.player);				
				}			
			}
		}
		
		if (this.currentMap.audio != null) {			
			Crafty.audio.play(this.currentMap.audio, -1);
		}
		
		// Make sure game-time tint is up to date
        Crafty.trigger('GameTimeChanged');
	},
	
	fadeOut: function() {
		this.fade
			.attr({ alpha: 0.0 })
			.tween({alpha: 1.0}, 1000);				
	},
	
	// TODO: can benefit from using the quad tree.
	findAdjacentInteractiveObject: function(x, y) {
		// TODO: use spatial partitioning to trim this list down.
		var minDistance = 9999999;
		var minObject = null;
		
		for (var i = 0; i < this.gameObjects.length; i++) {
			var obj = this.gameObjects[i];
			
			if (obj == this.player || !obj.has('Interactive')) {
				continue;
			}			
			
			// d = sqrt[(x1-x2)^2 + (y1-y2)^2]
			// d^2 = (x1-x2)^2 + (y1-y2)^2
			// Magic number "2": appx. d^2 for a 1x1 diagonal
			var dSquared = Math.pow(obj.gridX() - x, 2) + Math.pow(obj.gridY() - y, 2);
			if (dSquared <= 2 && dSquared <= minDistance) {
				minDistance = dSquared;
				minObject = obj;				
			}
		}
		
		return minObject;
	},
	
	removeFromMap: function(object) {
		var index = this.gameObjects.indexOf(object);
		if (index > -1) {
			this.gameObjects[index].destroy();
			this.gameObjects.slice(index, 1);
		} else {
			console.debug("Can't find object " + object + " to remove from game.");
		}
	},
	
	///// HELPER FUNCTIONZ /////
	
	createObjectFrom: function(def, player) {
		// Common properties
		var name = def.type
		if (typeof(def.components) != 'undefined') {
			name = name + ', ' + def.components;
		}
		
        var obj = Crafty.e(name + ', ' + def.sprite);
        obj.spriteName = def.sprite;
		obj.size(this.currentMap.tile.width, this.currentMap.tile.height);		
		obj.move(def.x, def.y);
		if (typeof(def.z) !== "undefined") {
			obj.attr({ z: def.z });
		} else {
			obj.attr({ z: 99 }); // Above = 200, below = 50, player = 100
		}		
		
		// A myriad of objects can talk
		// List of static messages
		obj.messages = def.messages || [];
		
		// Message generated from code
		if (def.onTalk != null) {
			obj.onTalk = def.onTalk;
		}
		
		if (def.type.toUpperCase() == 'WALKINGNPC') {			
			// Walking NPCs have velocity, too.		
			obj.velocity = def.velocity;
			if (obj.velocity == null) {
				throw new Error("Walking NPC defined without velocity. Use normal NPC instead.");
			}
		}
		
		if (typeof(def.onInteract) != 'undefined') {
			obj.interact = def.onInteract;
		}
        
        if (typeof(def.name) != 'undefined') {
            obj.name = def.name;
        }
		
		this.initializeAndAdd(def, obj, player);
	},
	
	initializeAndAdd: function(def, obj, player) {
		// Did we define custom intialization? Call it. (eg. positional audio NPCs)
		// First argument is the object itthis; second is the player.
		if (def.initialize != null) {
			def.initialize(obj, player);
		}
		this.gameObjects.push(obj);
	},
	
	// Is a tile occupied?
	// TODO: can benefit from using the quad tree.
	isOccupied: function(x, y) {
		for (var i = 0; i < this.gameObjects.length; i++) {
			var obj = this.gameObjects[i];			
			if (obj.gridX() == x && obj.gridY() == y) {
				return true;
			}
		}
		
		return false;
	}
}
