module('Entity Tests');

test( "Tree is solid", function() {
	var tree = Crafty.e('Tree');
	equal(tree.has('Solid'), true);
});

test( "Wall is solid", function() {
	var wall = Crafty.e('Wall');
	equal(wall.has('Solid'), true);
});