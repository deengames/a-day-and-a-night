Crafty.c('PositionalAudio', {

	// AudioID: from Crafty.audio.add
	PositionalAudio: function(audioId, radius) {		
		this.requires('Actor');
		
		this.audioId = audioId;
		// Use pixels, not tiles, so we get smoother transitions.
		// To replace with tiles, remove the * width * height here, and change
		// all instances of x/y to gridX/gridY in the d^2 calculation.
		this.radiusSquared = radius * radius * this.width * this.height;
		this.player = Crafty('Player');
		var self = this;
		
		this.timer = Crafty.e('Timer')
			.interval(100)
			.callback(function() {
				if (self.audioId == null) {
					throw new Error("PositionalAudio created but init() was never called.");
				}
				
				if (self.obj != null && self.x != null && self.y != null) {
					// Avoid sqrt: a^2 + b^2 = c^2
					var dSquared = Math.pow(self.x - self.player.x, 2) + Math.pow(self.y - self.player.y, 2);
					// Map (0 .. r^2) to (1 .. 0)
					var volume = Math.max(0, self.radiusSquared - dSquared) / self.radiusSquared;
					self.setVolume(volume);					
				} else {			
					for (var i = 0; i < Crafty.audio.channels.length; i++) {
						var c = Crafty.audio.channels[i];
						if (c.id == self.audioId) {					
							self.obj = c.obj;						
						}
					}
					
					if (self.obj == null) {
						throw new Error("Couldn't find audio for " + audioId);
					}
				}		
			})
			.start();
		
		this.bind('Remove', function() {
			if (this.audioId != null) {
				Crafty.audio.stop(this.audioId);				
			}
			this.timer.stop();
			delete this.timer;
		});
	},
	
	play: function() {
		Crafty.audio.play(this.audioId, -1);
	},
	
	setVolume: function(volume) {
		this.obj.volume = volume;
	}
});
