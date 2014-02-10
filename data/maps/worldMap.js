function worldMap() {
	var map = {		
		width:  30,
		height: 20,
		tile: {
			width:  32,
			height: 32
		},
		
		background: {
			image: 'sprite_grass', 
			x: 0, 
			y: 0
		},
		
		audio: 'outside',		
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
	
	return map;
}