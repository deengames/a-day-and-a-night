// A simple list of items.
// TODO: frequency map (item + count)
Crafty.c('Inventory', {
	init: function() {
		this.contents = [];
		// Let's us do stuff like player.inventory.add(...)
		this.inventory = this;
	},
	
	contains: function(name) {
        return this.indexOf(name) > -1;
	},
	
	add: function(item) {
        if (typeof(item.name) == 'undefined') {
            throw new Error("Won't add " + item + " to inventory. Please give it a name, so we can find it later.");
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
    }
});
