(function() { // Keep module global scope separate per module

	module('Entity Tests');

	test("NpcBase has default sprite", function() {
		var base = Crafty.e("NpcBase");
		equal(base.has('default_sprite'), true);
	});

	test("NpcBase.moveOnVelocity moves according to velocity", function() {
		var base = Crafty.e("NpcBase");
		base.setVelocity(200, 100);
		base.size(32, 32);
		base.move(0, 0);
		base.moveOnVelocity({ dt: 100 });
		ok(base.x > 0);
		ok(base.y > 0);
		ok(base.x == 2 * base.y);
	});
	
	test("NpcBase.talk throws with non-array", function() {
		var npc = Crafty.e("NpcBase");
		npc.setMessages("hi mom!");
		
		throws(function() {
			npc.talk();
		}, Error, "setMessages shouldn't accept non-arrays");
	});
	
	test("NpcBase.setMessages accepts null", function() {
		var npc = Crafty.e("NpcBase");
		npc.setMessages(null);
		ok(true, "setMessages shouldn't throw on null array");
	});
	
	test("NpcBase.setMessages accepts empty array", function() {
		var npc = Crafty.e("NpcBase");
		npc.setMessages([]);
		ok(true, "setMessages shoudln't throw on empty array");
	});
	
	test("NpcBase.talk throws when setMessages wasn't called", function() {
		var npc = Crafty.e("NpcBase");
		
		throws(function() {
			npc.talk();
		}, Error, "Calling talk before calling setMessages should throw");
	});

})();