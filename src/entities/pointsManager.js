Crafty.c('PointsManager', {
	
	init: function() {	
		// Array of objects with keys "event" and "points"	
		this._events = [];		
	},
	
	event: function(event, points) {
		if (typeof(event) == 'undefined' || typeof(event) != "string") {
			throw new Error("event() must have a string message as the first argument");
		}
		
		if (typeof(points) == 'undefined' || typeof(points) != "number") {
			throw new Error("event() must have a numerical point value as the second argument");
		}
		
		var e = {event: event, points: points};
		this._events.push(e);
		Crafty.trigger('PointsEvent', e);
		if (points >= 0) {
			Crafty.audio.play('pointsPos');
		} else {
			Crafty.audio.play('pointsNeg');
		}
	},
		
	totalPoints: function() {
		var total = 0;
		for (var i = 0; i < this._events.length; i++) {
			total += this._events[i].points;
		}
		
		return total;
	}
});
