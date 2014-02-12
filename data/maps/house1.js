function house1() {
	var map = {		
		width:  16,
		height: 10,
		
		tile: {
			width:  32,
			height: 32
		},
		
		background: 'indoor_floor',
		
		audio: '',		
		perimeter: 'indoor_wall',
		
		objects: [		
			{
				type: 'Door',				
				x: 1,
				y: 1,
				initialize: function(me, player) {
					me.transitionsTo('worldMap', 3, 3);					
				}
			}
		]
	};
	
	return map;
}