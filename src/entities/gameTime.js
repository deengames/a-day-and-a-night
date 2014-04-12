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
    
    toString: function() {
        return this.hour + ":" + this.minute;
    }
});
