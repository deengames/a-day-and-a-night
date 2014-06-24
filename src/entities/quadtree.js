Crafty.c('QuadTree', {
	
	init: function() {
		CELL_WIDTH = 100;
		CELL_HEIGHT = 100;
		
		var _cells;
		var _wCells = 0;
		var _hCells = 0;
		var _tracking = [];
	},
	
	setup: function(mapWidth, mapHeight) {
		this._cells = [];		
		this._wCells = Math.ceil(mapWidth / CELL_WIDTH);
		this._hCells = Math.ceil(mapWidth / CELL_HEIGHT);
			
		for (var x = 0; x < this._wCells; x++) {
			this._cells[x] = [];
			for (var y = 0; y < this._hCells; y++) {
				var cell = Crafty.e('Cell');
				cell.locate(x, y);
				this._cells[x].push(cell);
			}
		}
	},
	
	trackEverything: function(tag) {
		// Import everything tagged as "solid"
		var solids = Crafty(tag);
		for (var i = 0; i < solids.length; i++) {
			// Got IDs :/
			var e = Crafty(solids[i]);
			this.track(e);
		}
	},
	
	track: function(entity) {
		// Assume object has 2D component (x, y, moved function)		
		Crafty.bind('Move', function(oldPosition) {
			var oldCell = this.cellAt(oldPositon._x, oldPosition._y);			
			var newCell = this.cellAt(entity.x, entity.y)
			
			if (oldCell.x != newCell.x || oldCell.y != newCell.y) {
				oldCell.remove(entity);
				newCell.add(entity);
			}
		});
		
		this.cellAt(entity.x, entity.y).add(entity);
	},
	
	cellAt: function(x, y) {
		var xCell = Math.floor(x / CELL_WIDTH);
		var yCell = Math.floor(y / CELL_HEIGHT);
		return this._cells[xCell][yCell];
	},
	
	
	cellFor: function(obj) {
		return this.cellAt(obj.x, obj.y);
	}
});

// Private/inner class
Crafty.c("Cell", {
	
	init: function() {
		var x = 0;
		var y = 0;
		var _objects = [];
	},
	
	locate: function(x, y) {
		this.x = x;
		this.y = y;
	},
	
	add: function(obj) {
		this._objects.push(obj);
	},
	
	remove: function(obj) {
		var index = this._objects.indexOf(obj);
		this._objects.splice(index, 1);
	},
	
	contents: function() {
		return this._objects;
	}	
});
