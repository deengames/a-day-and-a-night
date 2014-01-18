test( "Grid: gridX and gridY get results of move(x, y)", function() {
	var grid = Crafty.e('Grid');
	grid.move(2, 7);
	equal(grid.gridX(), 2);
	equal(grid.gridY(), 7);
});