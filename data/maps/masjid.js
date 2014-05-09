function masjid() {
	var map = {		
		width:  25,
		height: 18,
		
		tile: {
			width:  32,
			height: 32
		},		
		
		objects: [
			{
				type: 'Door',
				sprite: 'default_sprite',
				initialize: function(me, player) {
					me.transitionsTo('worldMap', 14, 19);
				},
				x: 10, y: 17
			},
			{
				type: 'StandingNpc',
				sprite: 'npc_shaykh',
				x: 7, y: 8,
				messages: [ "Peace!" ]				
			}
		]
		
	};
	
	return map;
}
