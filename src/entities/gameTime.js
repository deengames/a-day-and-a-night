Crafty.c('GameTime', {
	
	init: function() {		
		this.timer = this.requires('Delay');			
	},
	
	timePerSecond: function(seconds) {
		this.timePerSecond = seconds;
		return this;
	},
	
	begin: function(timeString) {
		var timeRegex = /(\d):(\d\d)/;
		if (!timeRegex.test(timeString)) {
			throw new Error("Please enter a valid starting time in the format h:mm (not: " + timeString + ")");
		}
		var match = timeRegex.exec(timeString);
		
		this.startHour = parseInt(match[1]);
		this.startMinute = parseInt(match[2]);
		this.elapsedMilliseconds = 0;
		
		this.timer.delay(function() {
			this.elapsedMilliseconds += 1000 * this.timePerSecond;
			var elapsedSeconds = this.elapsedMilliseconds / 1000;
			var elapsedMinutes = elapsedSeconds / 60;
			var elapsedHours = elapsedMinutes / 60;
						
			var minute = Math.floor(this.startMinute + elapsedMinutes);
			this.hour = Math.floor(this.startHour + (elapsedMinutes / 60)) % 24;
			this.minute = minute % 60;
		}, 1000, -1);
		
		return this;		
	}
});
