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
					me.transitionsTo('masjid', 3, 3);
				},
				range: {
					start: { x: 13, y: 18 },
					end: { x: 15, y: 18 }
				}
			}		
		]
		
	};
	
	return map;
}
