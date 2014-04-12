Crafty.scene('Loading', function() {
	Crafty.background('black');
	
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	var loadingText = Crafty.e('2D, DOM, Text')
		.text('Loading ...')
		.attr({ x: 0, y: (Game.view.height - 72) / 2, w: Game.view.width })
		.textFont({ family: 'Georgia', size: '72px' })
		.css({ 'color': 'white', 'text-align': 'center' });
	
	// Load EVERYTHING, and don't worry about what map uses what stuff.
	Crafty.load(
		// Images
		[gameUrl + '/assets/images/titlescreen.png', gameUrl + '/assets/images/deen-games.png',
		gameUrl + '/assets/images/player.png', gameUrl + '/assets/images/world.png', 		
		gameUrl + '/assets/images/npc-1.png', gameUrl + '/assets/images/npc-2.png',
		gameUrl + '/assets/images/npc-3.png', gameUrl + '/assets/images/default-sprite.png', 
		gameUrl + '/assets/images/chicken-white.png', gameUrl + '/assets/images/chicken-red.png', 
		gameUrl + '/assets/images/indoors.png', gameUrl + '/assets/images/objects-outdoors.png',
		gameUrl + '/assets/images/main-character.png', gameUrl + '/assets/images/old-man-avatar.png', 
		gameUrl + '/assets/images/knight.png', gameUrl + '/assets/images/shield.png',
		// UI
		gameUrl + '/assets/images/message-window.png', gameUrl + '/assets/images/choice-box.png',
		// Sounds
		gameUrl + '/assets/audio/birds.mp3', gameUrl + '/assets/audio/chicken.mp3', gameUrl + '/assets/audio/chicken2.mp3',
		gameUrl + '/assets/audio/points-positive.mp3', gameUrl + '/assets/audio/points-negative.mp3'],
		
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
		
		Crafty.sprite(32, gameUrl + '/assets/images/knight.png', {
			knight:	[2, 0]
		});
		
		Crafty.sprite(24, 21, gameUrl + '/assets/images/chicken-white.png', {
			sprite_chicken_white:	[1, 0]
		});
		
		Crafty.sprite(24, 21, gameUrl + '/assets/images/chicken-red.png', {
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
		
		Crafty.sprite(16, 16, gameUrl + '/assets/images/objects-outdoors.png', {
			sprite_mushroom: [0, 0]
		});
		
		Crafty.sprite(32, 32, gameUrl + '/assets/images/shield.png', {
			shield: [0, 0]
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
    
    var blend = Crafty.e('2D, Color, Canvas, Blend') // Blend = tag		
		.color("rgb(0, 0, 128)")
		.attr({alpha: 0.5});	
	
    var startTime = "18:00";
    
    // 24s per second = 12h game time in 30m
    // 30s per second = 15h game time in 30m
    // 20s per second = 15h game time in 45m
    var gameTime = Crafty.e('GameTime').timePerSecond(30).begin(startTime);
    
    var gameTimeDisplay = Crafty.e('2D, Canvas, Text')
		.textFont({size: '18px'})
		.textColor('FFFFFF')
		.attr({ w: 64, z: 99999 })
		.text(startTime)
		.bind("EnterFrame", function() {
			this.x = Game.view.width - Crafty.viewport.x - 48;
			this.y = -Crafty.viewport.y + 4;
            this.text.y = -Crafty.viewport.y + 4;
		})
		
		.bind("GameTimeChanged", function() {			
			if (Game.currentMap.fileName == 'worldMap') {			
				this.text(gameTime.hour + ":" + (gameTime.minute < 10 ? "0" + gameTime.minute : gameTime.minute));
				// OVERALL TIME STRATEGY:
				// 5am to 7am: morning (sky lightens)
				// 7am to 6pm: nothing
				// 6pm to 8pm: sunset (orange)
				// 8pm to 10pm: fade to night
				// 10pm to 5am: night (dark blue)
				// NOTE: consistent, 120m transitions
				
				if (gameTime.hour >= 5 && gameTime.hour < 7) {
                    // Sky lightens to 7am		
					var elapsedMins = ((gameTime.hour - 5) * 60) + gameTime.minute;
					var blue = Math.round(128 - elapsedMins);
					if (blue <= 0) {
						blue = 0;
					}
					blend.attr({ alpha: blue / 255 });
					blend.color("rgb(0, 0, " + blue + ")");
					blend.attr({ alpha: blue / 255 });					
				} else if (gameTime.hour >= 18 && gameTime.hour < 20) {					
                    // Sunset from 6-8pm
					var remainingMins = ((20 - gameTime.hour) * 60) - gameTime.minute;
					var red = Math.round(128 - remainingMins);
					var green = Math.round(red / 2);
					
					if (red > 128) {
						red = 128;
					}
					blend.attr({ alpha: red / 255 });
					blend.color("rgb(" + red + ", " + green + ", 0)");
				} else if (gameTime.hour >= 20 && gameTime.hour < 22) {
                    // Fade to night from 8pm to 10pm
					var remainingMins = ((22 - gameTime.hour) * 60) - gameTime.minute;
					var elapsedMins = ((gameTime.hour - 20) * 60) + gameTime.minute;
					// Red from 128 to 0
					red = 128 - Math.round((elapsedMins/120)*128);
                    if (red < 0) {
                        red = 0;
                    }
					// Blue from 0 to 64
					blue = Math.round((elapsedMins / 120) * 64);
					if (blue > 64) {
                        blue = 64;
                    }
                    alpha = 0.5 + ((elapsedMins / 120) * 0.2);
                    if (alpha > 0.7) {
                        alpha = 0.7;
                    }
					blend.attr({ alpha: alpha });
					blend.color("rgb(" + red + ", 0, " + blue + ")");
				} else if (gameTime.hour >= 22 || gameTime.hour < 4) {
                    // dead of night
                    blend.color("rgb(0, 0, 64)");
					blend.attr({alpha: 0.7});
				} else if (gameTime.hour >= 4 && gameTime.hour <= 5) {
                    // Smooth transition from night to day
					// Blue: from 64 to 128
					blue = 64 + Math.round((gameTime.minute / 60) * 64);
					blend.color("rgb(0, 0, " + blue + ")");
					blend.attr({alpha: 0.7 - (gameTime.minute / 60) * 0.2});
				// Daylight hours
				} else {				
					blend.attr({ alpha: 0 });
				}
			} else {
				blend.attr({ alpha: 0 });
			}			
	});    
    
	var startingMap = "worldMap";	
	Game.showMap(startingMap);
	var map = Game.currentMap;
	
	blend.attr({w: Game.width(), h: Game.height(), z: 9999})
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
