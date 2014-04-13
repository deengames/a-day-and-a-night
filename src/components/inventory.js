// A simple list of items.
// TODO: frequency map (item + count)
Crafty.c('Inventory', {
	init: function() {
		this.contents = [];
		// Let's us do stuff like player.inventory.add(...)
		this.inventory = this;
        
        this.ui = [];
	},
	
	contains: function(name) {
        return this.indexOf(name) > -1;
	},
	
	add: function(item) {
        if (typeof(item.name) == 'undefined') {
            throw new Error("Won't add " + item + " to inventory. Please give it a name, so we can find it later.");
        } else if (typeof(item.spriteName) == 'undefined') {
            throw new Error("Won't add " + item + " to inventory. Please give it a sprite, to draw with.");
        }
        
		this.contents.push(item);
	},
	
	remove: function(name) {
		if (!this.contains(item)) {
			console.debug("Trying to remove non-exitent item named " + item + " from inventory: " + this.contents);
		} else {		
            var index = this.indexOf(item);
            this.contents.splice(index, 1);
        }
	},
    
    // Treat it like a normal array
    indexOf: function(name) {
        for (var i = 0; i < this.contents.length; i++) {
            if (this.contents[i].name.toUpperCase() == name.toUpperCase()) {
                return i;
            }
        }
        
        return -1;
    },
    
    show: function() {
        // Big assumptions: 
        // 1) Every item is unique, and only has one instance
        // 2) There are few enough items to fit on screen
        for (var i = 0; i < this.contents.length; i++) {
            var item = this.contents[i];
            var e = Crafty.e('Actor, ' + item.spriteName)
                // Max: 5x5. Yes, really. Assume 100x100. Use spacing, and pad 10px;
                // x total: 800, -500 item, -50 padding; 250 left (125/side)
                .attr({ x: (i % 5 * 100) + (10 * (i % 5)) + 125,
                        y: (i / 5 * 100) + (i/5 * 10) + 25,
                        w: 100,
                        h: 100 });
            e.z = 100000;
            this.ui.push(e);
        }
    },
    
    hide: function() {
        for (var i = 0; i < this.ui.length; i++) {
            this.ui[i].destroy();
        }
    }
});
