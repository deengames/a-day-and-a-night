(function() { // Keep module global scope separate per module

	module('Entity Tests');

	test("Wall is solid", function() {
		var wall = Crafty.e('Wall');
		equal(wall.has('Solid'), true);
	});

	test("Tree is solid", function() {
		var tree = Crafty.e('Tree');
		equal(tree.has('Solid'), true);
	});

	test("NpcBase has default sprite", function() {
		var base = Crafty.e("NpcBase");
		equal(base.has('default_sprite'), true);
	});

	test("NpcBase.moveOnVelocity moves according to velocity", function() {
		var base = Crafty.e("NpcBase");
		base.setVelocity(200, 100);
		base.move(0, 0);
		base.moveOnVelocity({ dt: 100 });
		ok(base.x > 0);
		ok(base.y > 0);
		ok(base.x == 2 * base.y);
	});
	
	test("NpcBase.setMessages throws with null and non-array", function() {
		var npc = Crafty.e("NpcBase");
		
		throws(function() {
			npc.setMessages(null);
		}, Error, "setMessages shouldn't accept null");
		
		throws(function() {
			npc.setMessages("hi mom!");
		}, Error, "setMessages shouldn't accept non-arrays");
	});
	
	test("NpcBase.setMessages accepts empty array", function() {
		var npc = Crafty.e("NpcBase");
		npc.setMessages([]);
		ok(true, "setMessages didn't throw on empty array");
	});
	
	test("NpcBase.talk throws when setMessages wasn't called", function() {
		var npc = Crafty.e("NpcBase");
		
		throws(function() {
			npc.talk();
		}, Error, "Calling talk before calling setMessages should throw");
	});

})();