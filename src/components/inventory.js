// A simple list of items.
// TODO: frequency map (item + count)
Crafty.c('Inventory', {
	init: function() {
		this.contents = [];
		// Let's us do stuff like player.inventory.add(...)
		this.inventory = this;
	},
	
	contains: function(item) {
		return this.contents.indexOf(item) > -1;
	},
	
	add: function(item) {
		this.contents.push(item);
	},
	
	remove: function(item) {
		if (!this.contains(item)) {
			console.debug("Trying to remove non-exitent item " + item + " from inventory: " + this.contents);
		}
		
		var index = this.contents.indexOf(item);
		this.contents.splice(index, 1);
	}	
});
