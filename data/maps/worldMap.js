function mainMap(player) {
	var mainMap = {		
		width:  50,
		height: 40,
		tile: {
			width:  32,
			height: 32
		},		
		objects: []
	};
	
	// Top and bottom walls
	for (var x = 0; x < mainMap.width; x++) {
		var obj = Crafty.e('Wall');
		obj.size(mainMap.tile.width, mainMap.tile.height);
		obj.move(x, 0);
		mainMap.objects.push(obj);
		
		obj = Crafty.e('Wall');
		obj.size(mainMap.tile.width, mainMap.tile.height);
		obj.move(x, mainMap.height - 1);		
		mainMap.objects.push(obj);
	}
	
	// Left and right walls
	for (var y = 0; y < mainMap.height; y++) {
		var obj = Crafty.e('Wall');
		obj.size(mainMap.tile.width, mainMap.tile.height);
		obj.move(0, y);
		mainMap.objects.push(obj);
		
		obj = Crafty.e('Wall');
		obj.size(mainMap.tile.width, mainMap.tile.height);
		obj.move(mainMap.width - 1, y);
		mainMap.objects.push(obj);
	}
	
	// NPCs (including chickens)
	var npc = Crafty.e('Npc', 'sprite_npc2');
	npc.setMessages(["Salam!", "Peace!"]);
	npc.size(mainMap.tile.width, mainMap.tile.height);
	npc.move(8, 8);
	mainMap.objects.push(npc);
	
	var npc2 = Crafty.e('WalkingNpc', 'sprite_npc1');
	npc2.setMessages(["Catch me if you can!", "Let's see how fast you can run!"]);
	npc2.size(mainMap.tile.width, mainMap.tile.height);
	npc2.move(12, 11);
	npc2.setVelocity(90, 0);
	mainMap.objects.push(npc2);
	
	var chicken = Crafty.e('Npc, PositionalAudio, sprite_chicken_white');	
	chicken.size(mainMap.tile.width, mainMap.tile.height);
	chicken.PositionalAudio('chicken', 5, player)
	chicken.move(18, 18);
	chicken.play();
	mainMap.objects.push(chicken);
	
	chicken = Crafty.e('Npc, PositionalAudio, sprite_chicken_red');	
	chicken.size(mainMap.tile.width, mainMap.tile.height);
	chicken.PositionalAudio('chicken2', 5, player)	
	chicken.move(40, 30);
	chicken.play();
	mainMap.objects.push(chicken);
	
	return mainMap;
}