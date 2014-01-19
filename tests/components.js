(function() { // Keep module global scope separate per module

	module('Component Tests');

	test( "Grid's gridX and gridY get results of move(x, y)", function() {
		var grid = Crafty.e('Grid');
		grid.move(2, 7);
		equal(grid.gridX(), 2);
		equal(grid.gridY(), 7);
	});

	test( "Interactive's interact invokes function from onInteract", function() {
		var isSuccess = false;
		e = Crafty.e('Interactive');
		e.onInteract(function() {
			isSuccess = true;
		});
		e.interact();
		equal(isSuccess, true);
	});

})();