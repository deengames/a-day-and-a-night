Crafty.scene('Loading', function() {
	Crafty.background('black');
	
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
		.text('Loading ...')
		.attr({ x: 0, y: (Game.view.height - 72) / 2, w: Game.view.width })
		.textFont({ family: 'Georgia', size: '72px' })
		.css({ 'color': 'white', 'text-align': 'center' });

	Crafty.load([gameUrl + '/assets/images/player.png', gameUrl + '/assets/images/world.png', gameUrl + '/assets/images/deen-games.png', gameUrl + '/assets/images/npc-1.png', gameUrl + '/assets/images/npc-2.png', gameUrl + '/assets/images/default-sprite.png', gameUrl + '/assets/audio/birds.mp3', gameUrl + '/assets/images/chicken-white.png', gameUrl + '/assets/images/chicken-red.png', gameUrl + '/assets/audio/chicken.mp3', gameUrl + '/assets/audio/chicken2.mp3'], function() {
	
		Crafty.sprite(32, gameUrl + '/assets/images/player.png', {
			sprite_player:	[1, 0]
		});
		
		// Used to initialize NPCs; displayed if the user doesn't pass in a sprite.
		Crafty.sprite(32, gameUrl + '/assets/images/default-sprite.png', {
			default_sprite:	[0, 0]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/npc-1.png', {
			sprite_npc1:	[1, 0]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/npc-2.png', {
			sprite_npc2:	[2, 0]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/chicken-white.png', {
			sprite_chicken_white:	[1, 0]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/chicken-red.png', {
			sprite_chicken_red:	[1, 0]
		});
		
		Crafty.sprite(32, 32, gameUrl + '/assets/images/world.png', {			
			sprite_wall: [0, 0],
			sprite_tree: [1, 0]
		});
		
		Crafty.audio.add({
			outside: [gameUrl + '/assets/audio/birds.mp3'], 
			chicken: [gameUrl + '/assets/audio/chicken.mp3'],
			chicken2: [gameUrl + '/assets/audio/chicken2.mp3']
			// tone: [gameUrl + '/assets/audio/tone.mp3']
		});
		
		// Loading done. Launch game.
		Crafty.scene('MainMap');
	});
});

Crafty.scene('SplashScreen', function() {
	Crafty.load(gameUrl + '/assets/images/deen-games.png', function() {
		Crafty.background('black');
		// Canvas is necessary for smooth tweens.
		var logo = Crafty.e('2D, Canvas, Image, Tween')
			.image(gameUrl + '/assets/images/deen-games.png')		
			.attr({ x: 0, y: (Game.view.height - 408) / 2, alpha: 0.0 })
			
			// Fade in for 2s
			.tween({ alpha: 1.0 }, 2000)		
			.bind('TweenEnd', function() {
				// Then, maintain for 2s
				logo.unbind('TweenEnd')
				.tween(null, 2000)
				.bind('TweenEnd', function() {
					// Then, fade out for 2s
					logo.unbind('TweenEnd')
					.tween({ alpha: 0.0 }, 2000)			
					.bind('TweenEnd', function() {
						// Then, change scenes
						Crafty.scene('Loading');
					});
				});
			});
	});
});

Crafty.scene('MainMap', function() {
	
	var self = this;
		
	var map = mainMap();
	Game.currentMap = map;
	
	this.player = Crafty.e('Player');		
	this.player.move(3, 3);
	this.gameObjects = [this.player];	
	
	var npc = Crafty.e('Npc', 'sprite_npc2');
	npc.setMessages(["Salam!", "Peace!"]);
	npc.move(8, 8);
	this.gameObjects.push(npc);
	
	var npc2 = Crafty.e('WalkingNpc', 'sprite_npc1');
	npc2.setMessages(["Catch me if you can!", "Let's see how fast you can run!"]);
	npc2.move(12, 11);
	npc2.setVelocity(90, 0);
	this.gameObjects.push(npc2);
	
	var chicken = Crafty.e('Npc, PositionalAudio, sprite_chicken_white');
	chicken.PositionalAudio('chicken', 5, this.player)
	chicken.move(18, 18);
	chicken.play();
	this.gameObjects.push(chicken);
	
	chicken = Crafty.e('Npc, PositionalAudio, sprite_chicken_red');
	chicken.PositionalAudio('chicken2', 5, this.player)
	chicken.move(40, 30);
	chicken.play();
	this.gameObjects.push(chicken);
	
	Crafty.background('#d2ffa6');
	Crafty.audio.play('outside', -1);
	
	var fade = Crafty.e('2D, Canvas, Color, Tween')
		.attr({w: Game.width(), h: Game.height(), alpha: 1.0, z: 99999 })
		.color('black')
		.tween({alpha: 0.0}, 1000);
		
	grass = Crafty.e('2D, Canvas, Image')		
		.attr({w: Game.width(), h: Game.height(), z: -100 })
		.image('assets/images/grass.png', 'repeat');
	
	// Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.currentMap.width; x++) {
		for (var y = 0; y < Game.currentMap.height; y++) {
			
			var isAtEdge = x == 0 || x == Game.currentMap.width - 1 || y == 0 || y == Game.currentMap.height - 1;
			var obj = null;
			
			if (isAtEdge) {
				// Place a wall entity at the current tile
				obj = Crafty.e('Wall');				
			} else if (Math.random() < 0.06 && !isOccupied(x, y)) {
				obj = Crafty.e('Tree');				
			}		
			
			if (obj != null) {
				obj.move(x, y);
				this.gameObjects.push(obj);				
			}
		}
	}
	
	Crafty.viewport.follow(this.player, 0, 0);
	
	// Did the player try to interact with something close by?	
	// Space to interact with stuff
	this.bind('KeyDown', function(data) {
		if (data.key == Crafty.keys['SPACE']) {			
			var x = this.player.gridX();
			var y = this.player.gridY();
						
			var obj = findAdjacentInteractiveObject(x, y);
			if (obj != null) {				
				obj.interact();
			}
		}
	});
	
	// HELPER FUNCTIONZ
	// Is a tile occupied?
	function isOccupied(x, y) {
		for (var i = 0; i < self.gameObjects.length; i++) {
			var obj = self.gameObjects[i];			
			if (obj.gridX() == x && obj.gridY() == y) {
				return true;
			}
		}
		
		return false;
	}
	
	function findAdjacentInteractiveObject(x, y) {
		// TODO: use spatial partitioning to trim this list down.
		for (var i = 0; i < self.gameObjects.length; i++) {
			var obj = self.gameObjects[i];
			
			if (obj == self.player || !obj.has('Interactive')) {
				continue;
			}			
			
			// d = sqrt[(x1-x2)^2 + (y1-y2)^2]
			// or: d^2 = (x1-x2)^2 + (y1-y2)^2
			// d^2 = 2 (1^2 + 1^2 for diagonals)			
			var dSquared = Math.pow(obj.gridX() - x, 2) + Math.pow(obj.gridY() - y, 2);
			if (dSquared <= 2) {				
				return obj;
			}
		}
		
		return null;
	}
});