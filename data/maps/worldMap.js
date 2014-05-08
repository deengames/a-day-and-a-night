function worldMap() {
	var map = {		
		width:  50,
		height: 30,
		
		tile: {
			width:  32,
			height: 32
		},
		
		background: 'world_grass',
		
		audio: 'outside',		
		perimeter: 'world_wall',
		
		objects: [
			{
				type: 'Door',
				sprite: 'default_sprite',
				initialize: function(me, player) {
					me.transitionsTo('masjid', 10, 16);
				},
				range: {
					start: { x: 13, y: 18 },
					end: { x: 15, y: 18 }
				}
			},
			{
				type: 'Npc',
				sprite: 'hijabi_aunty',
				x: 14, y: 22,
				messages: [
					[
						{ character: "woman", text: "Young man ..." },
						{ character: "woman", text: "Follow the footsteps of your forefather, Prophet Abraham." },
						{ character: "woman", text: "He submitted to the creator of everything, alone, and did not worship anything beside Him." }
					]
				]
			}	
		]
		
	};
	
	return map;
}
