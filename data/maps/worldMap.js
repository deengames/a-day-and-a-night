function worldMap() {
	var map = {		
		width:  30,
		height: 20,
		tile: {
			width:  32,
			height: 32
		},
		
		perimeter: 'Wall',
		
		objects: [
			{
				type: 'Npc',
				sprite: 'sprite_npc2',
				messages: ['Salam!', 'Peace!'],
				x: 8, y: 8
			},
			{
				type: 'WalkingNpc',
				sprite: 'sprite_npc1',
				messages: ['Catch me if you can!', "Let's see how fast you can run!"],
				x: 18, y: 11,
				velocity: { x: 90, y: 0 }
			},
			{
				type: 'Npc',
				sprite: 'sprite_chicken_white',				
				x: 18, y: 18,	
				components: 'PositionalAudio',				
				initialize: function(me, player) {
					me.PositionalAudio('chicken', 5, player);
					me.play();
				}
			},
			{
				type: 'Npc',
				sprite: 'sprite_chicken_red',				
				x: 20, y: 15,	
				components: 'PositionalAudio',				
				initialize: function(me, player) {
					me.PositionalAudio('chicken2', 5, player);
					me.play();
				}
			},
			{
				range: { start: { x: 6, y: 10 }, end: { x: 16, y: 14 } },
				type: 'Tree'
			}
		]
	};
	
	/*	
	for (var y = 10; y < 14; y++) {
		for (var x = 6; x < 16; x++) {
			if (x != 14 && y != 12) {
			var tree = Crafty.e('Tree');
			tree.size(mainMap.tile.width, mainMap.tile.height);
			tree.move(x, y);
			mainMap.objects.push(tree);
			}
		}
	}
	*/
	
	return map;
}