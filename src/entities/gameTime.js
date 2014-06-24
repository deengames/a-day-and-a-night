// Emits a "GameTimeChanged" event when time changes
// timePerSecond is how many seconds of game time pass per 1s of real time
// Use the .hour and .minute properties to tell the current time.
Crafty.c('GameTime', {
	
	init: function() {		
		this._timer = this.requires('Delay');
		this.hour = 0;
		this.minute = 0;	
	},
	
	// How much game time elapses per second of realtime?
	timePerSecond: function(seconds) {
		this.timePerSecond = seconds;
		return this;
	},
	
	begin: function(timeString) {
		var timeRegex = /(\d\d?):(\d\d)/;
		if (!timeRegex.test(timeString)) {
			throw new Error("Please enter a valid starting time in the format h:mm (not: " + timeString + ")");
		}
		var match = timeRegex.exec(timeString);
		
		this._startHour = parseInt(match[1]);
		this._startMinute = parseInt(match[2]);
		
		this.hour = this._startHour;
		this.minute = this._startMinute;
		
		this.elapsedMilliseconds = 0;
		
		this._timer.delay(function() {
			this.elapsedMilliseconds += 1000 * this.timePerSecond;
			var elapsedSeconds = this.elapsedMilliseconds / 1000;
			var elapsedMinutes = this.elapsedMilliseconds / (1000 * 60);
			var elapsedHours = elapsedMinutes / (1000 * 60 * 60);
						
			var prevMinute = this.minute;
			var prevHour = this.hour;
			
			var minute = Math.floor(this._startMinute + elapsedMinutes);
			this.hour = (this._startHour + Math.floor(elapsedMinutes / 60)) % 24;
			this.minute = minute % 60;			
			
			if (this.minute != prevMinute || this.hour != prevHour) {
				Crafty.trigger("GameTimeChanged");
			}
			
		}, 1000, -1);
		
		return this;		
	},
    
    // Tints the screen to give the appearance of time of day
    tintWithTime: function() {
        this.blend = Crafty.e('Actor, Color')		
            .color("rgb(0, 0, 128)")
            .attr({alpha: 0.5, z: 9999});

        this.bind('GameTimeChanged', function() {
            if (Game.currentMap.fileName == 'worldMap') {
                // OVERALL TIME STRATEGY:
                // 5am to 7am: morning (sky lightens)
                // 7am to 6pm: nothing
                // 6pm to 8pm: sunset (orange)
                // 8pm to 10pm: fade to night
                // 10pm to 5am: night (dark blue)
                // NOTE: consistent, 120m transitions
                
                if (this.hour >= 5 && this.hour < 7) {
                    // Sky lightens to 7am		
                    var elapsedMins = ((this.hour - 5) * 60) + this.minute;
                    var blue = Math.round(128 - elapsedMins);
                    if (blue <= 0) {
                        blue = 0;
                    }
                    this.blend.attr({ alpha: blue / 255 });
                    this.blend.color("rgb(0, 0, " + blue + ")");
                    this.blend.attr({ alpha: blue / 255 });					
                } else if (this.hour >= 18 && this.hour < 20) {					
                    // Sunset from 6-8pm
                    var remainingMins = ((20 - this.hour) * 60) - this.minute;
                    var red = Math.round(128 - remainingMins);
                    var green = Math.round(red / 2);
                    
                    if (red > 128) {
                        red = 128;
                    }
                    this.blend.attr({ alpha: red / 255 });
                    this.blend.color("rgb(" + red + ", " + green + ", 0)");
                } else if (this.hour >= 20 && this.hour < 22) {
                    // Fade to night from 8pm to 10pm
                    var remainingMins = ((22 - this.hour) * 60) - this.minute;
                    var elapsedMins = ((this.hour - 20) * 60) + this.minute;
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
                    this.blend.attr({ alpha: alpha });
                    this.blend.color("rgb(" + red + ", 0, " + blue + ")");
                } else if (this.hour >= 22 || this.hour < 4) {
                    // dead of night
                    this.blend.color("rgb(0, 0, 64)");
                    this.blend.attr({alpha: 0.7});
                } else if (this.hour >= 4 && this.hour <= 5) {
                    // Smooth transition from night to day
                    // Blue: from 64 to 128
                    blue = 64 + Math.round((this.minute / 60) * 64);
                    this.blend.color("rgb(0, 0, " + blue + ")");
                    this.blend.attr({alpha: 0.7 - (this.minute / 60) * 0.2});
                // Daylight hours
                } else {				
                    this.blend.attr({ alpha: 0 });
                }
            } else {
                this.blend.attr({ alpha: 0 });
            }
        });
        
        return this;
    },
    
    setTintSize: function(width, height) {
        this.blend.w = width;
        this.blend.h = height;
        return this;
    },
    
    toString: function() {
        return this.hour + ":" + this.minute;
    }
});
