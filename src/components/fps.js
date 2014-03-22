Crafty.c('Fps', {
    init: function() {
        this.ticks = 0;
        this.lastReportedOn = new Date().getTime();
        
        this.bind('MeasureRenderTime', function(elapsed) {
            this.ticks += 1;
        });
        
        this.text = Crafty.e("DOM, 2D, Text")
            .textFont({size: '14px'})
			.textColor('FFFFFF')
			.text("checking fps ...")
            .attr({w: 256, x: 4, y: 4 });
        
        this.bind('EnterFrame', function() {
            var now = new Date().getTime();            
            var seconds = (now - this.lastReportedOn) / 1000;
            
            if (seconds >= 1) {
                this.text.text(Math.round(this.ticks / seconds) + " fps");
                this.ticks = 0;
                this.lastReportedOn = now;
            }
            
            // Hover in-place
            this.text.x = -Crafty.viewport.x + 4;
            this.text.y = -Crafty.viewport.y + 4;
        });
    }
});
