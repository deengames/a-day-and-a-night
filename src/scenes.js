Crafty.scene('Loading', function() {
	Crafty.background('black');
	
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	var loadingText = Crafty.e('2D, DOM, Text')
		.text('Loading ...')
		.attr({ x: 0, y: (Game.view.height - 72) / 2, w: Game.view.width })
		.textFont({ family: 'Georgia', size: '72px' })
		.css({ 'color': 'white', 'text-align': 'center' });
	
	///////////// TODO: move this list of assets into a data file
	var assets = [
		// Images
		'/assets/images/titlescreen.png', '/assets/images/deen-games.png',
		'/assets/images/player.png', '/assets/images/world.png', 		
		'/assets/images/npc-1.png', '/assets/images/npc-2.png',
		'/assets/images/npc-3.png', '/assets/images/default-sprite.png', 
		'/assets/images/chicken-white.png', '/assets/images/chicken-red.png', 
		'/assets/images/indoors.png', 
		'/assets/images/main-character.png', '/assets/images/old-man-avatar.png', 		
		'/assets/images/hijabi-aunty.png', '/assets/images/npc-shaykh.png',
		'/assets/images/student-1.png', '/assets/images/student-2.png',
		'/assets/images/statue-worshipper.png',
		// UI
		'/assets/images/message-window.png', '/assets/images/choice-box.png',
		'/assets/images/inventory-icon.png', '/assets/images/achievements-icon.png',
		// Sounds
		'/assets/audio/birds.mp3', '/assets/audio/chicken.mp3', '/assets/audio/chicken2.mp3',
		'/assets/audio/points-positive.mp3', '/assets/audio/points-negative.mp3'
	];
	
	for (var i = 0; i < assets.length; i++) {
		assets[i] = gameUrl + assets[i];		
	}
	
	// Load EVERYTHING, and don't worry about what map uses what stuff.	
	Crafty.load(assets, function() {
		
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
		
		Crafty.sprite(32, gameUrl + '/assets/images/student-1.png', {
			student_1:		[1, 2]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/student-2.png', {
			student_2:		[1, 2]
		});
		
		Crafty.sprite(24, 21, gameUrl + '/assets/images/chicken-white.png', {
			sprite_chicken_white:	[1, 0]
		});
		
		Crafty.sprite(24, 21, gameUrl + '/assets/images/chicken-red.png', {
			sprite_chicken_red:	[1, 0]
		});
		
		Crafty.sprite(32, 32, gameUrl + '/assets/images/world.png', {
			world_grass:	[0, 0],
			world_wall: 	[4, 0]			
		});
		
		Crafty.sprite(32, 32, gameUrl + '/assets/images/indoors.png', {
			indoor_floor:	[0, 0],
			indoor_wall: 	[1, 0],
			indoor_door:	[2, 0]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/hijabi-aunty.png', {
			hijabi_aunty: [0, 0]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/npc-shaykh.png', {
			npc_shaykh: [1, 1]
		});
		
		Crafty.sprite(32, gameUrl + '/assets/images/statue-worshipper.png', {
			statue_worshipper: [1, 1]
		});
		
		Crafty.audio.add({
			outside: [gameUrl + '/assets/audio/birds.mp3'], 
			chicken: [gameUrl + '/assets/audio/chicken.mp3'],
			chicken2: [gameUrl + '/assets/audio/chicken2.mp3'],
			pointsPos: [gameUrl + '/assets/audio/points-positive.mp3'],
			pointsNeg: [gameUrl + '/assets/audio/points-negative.mp3'],
			// tone: [gameUrl + '/assets/audio/tone.mp3']
		});
		
		// Loading done. Launch game.
		if (typeof(debug) != "undefined" && debug != null && debug == true) {
			Crafty.scene('TitleScreen');
		} else {					
			Crafty.scene('SplashScreen');
		}
	}, function(progress) {
		loadingText.text(Math.round(progress.percent) + "% loaded");
	}, function(e) {
		console.debug(e);
	});
});

Crafty.scene('SplashScreen', function() {	
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
					Crafty.scene('Titlescreen');
				});
			});
		});
});

Crafty.scene('TitleScreen', function() {
	Crafty.background('black');
	// Canvas is necessary for smooth tweens.
	var logo = Crafty.e('2D, Canvas, Image, Tween, Mouse')
		.image(gameUrl + '/assets/images/titlescreen.png')		
		.attr({ x: 0, y: 0, alpha: 0.0 })
		
		// Fade in for 2s
		.tween({ alpha: 1.0 }, 1000)		
		.bind('TweenEnd', function() {
			// Then, maintain for 1s
			logo.unbind('TweenEnd')
			.tween(null, 1000)
			.bind('TweenEnd', function() {
				// Then, fade out for 1s    
				logo.unbind('TweenEnd')
				.tween({ alpha: 0.0 }, 1000)			
				.bind('TweenEnd', function() {
					// Then, change scenes						
					Crafty.scene('Map');
				});
			});
		});
	
	logo.bind('Click', function() {		
		logo.tween({ alpha: 0.0 }, 500);
	});
});

Crafty.scene('Map', function() {
	
	var self = this;	
	
	var player = Crafty.e('Player');
	Game.player = player;
    
    Crafty.e('Fps');
    Crafty.e("PointsManager");
    // Revert to 5am for the real game
    var startTime = "8:00";
    
    // 24s per second = 12h game time in 30m
    // 30s per second = 15h game time in 30m
    // 20s per second = 15h game time in 45m
    var gameTime = Crafty.e('GameTime').timePerSecond(30).begin(startTime).tintWithTime();
    
    var gameTimeDisplay = Crafty.e('Actor, Text')
		.textFont({size: '18px'})
		.textColor('FFFFFF')
		.attr({ w: 64, z: 100000 })
		.text(startTime)
		.bind("EnterFrame", function() {
			this.x = Game.view.width - Crafty.viewport.x - 48;
			this.y = -Crafty.viewport.y + 4;
            this.text.y = -Crafty.viewport.y + 4;
		}).bind("GameTimeChanged", function() {	
			this.text(gameTime.hour + ":" + (gameTime.minute < 10 ? "0" + gameTime.minute : gameTime.minute));
        });
    
	var startingMap = "worldMap";	
	Game.showMap(startingMap);
	var map = Game.currentMap;
	
	gameTime.setTintSize(Game.width(), Game.height());	
	player.size(map.tile.width, map.tile.height);
	player.move(3, 3);	
	
	Crafty.viewport.follow(player, 0, 0);
	
	// Did the player try to interact with something close by?	
	// Space to interact with stuff
	this.bind('KeyDown', function(data) {		
		if (data.key == Crafty.keys['SPACE']) {
			
			// If there's an open dialog with someone, do that first
			if (typeof(dialog) != 'undefined' && dialog.source != null) {
				dialog.source.npc.interact();
			} else {
				var x = player.gridX();
				var y = player.gridY();
							
				var obj = Game.findAdjacentInteractiveObject(x, y);
				if (obj != null) {				
					obj.interact();
				}
			}
		}
	});
});
