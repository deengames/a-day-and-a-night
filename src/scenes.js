Crafty.scene('Loading', function() {
	Crafty.background('black');
	
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
		.text('Loading ...')
		.attr({ x: 0, y: (Game.view.height - 72) / 2, w: Game.view.width })
		.textFont({ family: 'Georgia', size: '72px' })
		.css({ 'color': 'white', 'text-align': 'center' });

	// Load EVERYTHING, and don't worry about what map uses what stuff.
	Crafty.load(
		// Images
		[gameUrl + '/assets/images/player.png', gameUrl + '/assets/images/world.png', gameUrl + '/assets/images/deen-games.png', gameUrl + '/assets/images/npc-1.png', gameUrl + '/assets/images/npc-2.png', gameUrl + '/assets/images/npc-3.png', gameUrl + '/assets/images/default-sprite.png', 
		gameUrl + '/assets/images/chicken-white.png', gameUrl + '/assets/images/chicken-red.png', 
		gameUrl + '/assets/images/indoors.png',
		// Sounds
		gameUrl + '/assets/audio/birds.mp3', gameUrl + '/assets/audio/chicken.mp3', gameUrl + '/assets/audio/chicken2.mp3'],
	function() {
	
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
		
		Crafty.sprite(32, gameUrl + '/assets/images/npc-3.png', {
			sprite_npc3:	[2, 0]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/chicken-white.png', {
			sprite_chicken_white:	[1, 0]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/chicken-red.png', {
			sprite_chicken_red:	[1, 0]
		});
		
		Crafty.sprite(32, 32, gameUrl + '/assets/images/world.png', {
			world_grass:	[0, 0],
			world_wall: 	[1, 0],
			world_tree:		[2, 0]
		});
		
		Crafty.sprite(32, 32, gameUrl + '/assets/images/indoors.png', {
			indoor_floor:	[0, 0],
			indoor_wall: 	[1, 0],
			indoor_door:	[2, 0]
		});
		
		Crafty.audio.add({
			outside: [gameUrl + '/assets/audio/birds.mp3'], 
			chicken: [gameUrl + '/assets/audio/chicken.mp3'],
			chicken2: [gameUrl + '/assets/audio/chicken2.mp3']
			// tone: [gameUrl + '/assets/audio/tone.mp3']
		});
		
		// Loading done. Launch game.				
		Crafty.scene('map');
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

Crafty.scene('map', function() {
	
	var self = this;
	
	var player = Crafty.e('Player');
	Game.player = player;
	
	var startingMap = "worldMap";
	var map = Game.maps[startingMap]
	Game.showMap(startingMap);
	
	player.size(map.tile.width, map.tile.height);
	player.move(3, 3);	
	
	Crafty.viewport.follow(player, 0, 0);
	
	// Did the player try to interact with something close by?	
	// Space to interact with stuff
	this.bind('KeyDown', function(data) {
		if (data.key == Crafty.keys['SPACE']) {			
			var x = player.gridX();
			var y = player.gridY();
						
			var obj = Game.findAdjacentInteractiveObject(x, y);
			if (obj != null) {				
				obj.interact();
			}
		}
	});
});