function mainMap(player) {
	var mainMap = {		
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
			}
		]
	};
	
	/*	
	var chicken = Crafty.e('Npc, PositionalAudio, sprite_chicken_white');	
	chicken.size(mainMap.tile.width, mainMap.tile.height);
	chicken.PositionalAudio('chicken', 5, player)
	chicken.move(18, 18);
	chicken.play();
	mainMap.objects.push(chicken);
	
	chicken = Crafty.e('Npc, PositionalAudio, sprite_chicken_red');	
	chicken.size(mainMap.tile.width, mainMap.tile.height);
	chicken.PositionalAudio('chicken2', 5, player)	
	chicken.move(20, 15);
	chicken.play();
	mainMap.objects.push(chicken);
	
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
	
	return mainMap;
}