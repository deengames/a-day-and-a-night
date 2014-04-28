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
					me.transitionsTo('masjid', 3, 3);
				},
				x: 10, y: 19
			}
		]
		
	};
	
	return map;
}
