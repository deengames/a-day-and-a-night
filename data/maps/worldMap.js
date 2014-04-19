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
                sprite: 'indoor_door',
				initialize: function(me, player) {
					me.transitionsTo('testHouse', 3, 3);					
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
