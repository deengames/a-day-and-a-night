/**
 * Creates a timer component, which calls a function on an interval.
 * The example below prints "!" once per second for five seconds, and
 * then stops. 
 * 
 	var timer = Crafty.e('Timer')
		.interval(1000)
		.callback(function() { 
			console.debug("!") 
			timer.count = typeof(timer.count) == 'undefined' ? 1 : timer.count + 1;
			if (timer.count == 5) {
				timer.stop();
			}
		})
		.start();
 */
Crafty.c('Timer', {
	
	init: function() {
		this.intervalMs = 0;
	},
	
	// Sets how often to trigger (in milliseconds)
	interval: function(milliseconds) {
		this.intervalMs = milliseconds;
		return this;
	},
	
	// Sets the function to call when time elapses
	callback: function(callback) {
		this.callback = callback;
		return this;
	},
	
	// Starts running the timer
	start: function() {
		var self = this;
		this._ref = setInterval(function() { self.callback() }, this.intervalMs);
		return this;
	},
	
	// Stops and cleans up the timer
	stop: function() {
		clearInterval(this._ref);
		delete this._ref;
		return this;
	}
	
});
