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
			},
			{
				type: 'Npc',
				x: 19, y: 2,
				sprite: 'sprite_npc3',
				messages: [
					["That statue ...", "Can it help me?",
					"Can it harm me?", "Can it even hear me?", "Hmm ..."]
				]
			},
			{
				type: 'StandingNpc',
				x: 5, y: 7,
				sprite: 'student_1',
				messages: ["I've been studying with this shaykh for five years now."]
			},
			{
				type: 'StandingNpc',
				x: 5, y: 9,
				sprite: 'student_2',
				messages: ["I like what he's teaching."]
			},
			{
				type: 'StandingNpc',
				x: 18, y: 2,
				messages: [
					[
						{ 
							text: "Pray to the fake god?", 
							choices: ["Yes", "No"], responses: [ "SHIRK AL-AKBAR!", "Phew, that was a close one!" ]
						}
					]
				],				
				initialize: function(me, player) {
					me.disableCollisionCheck();
				}
			}
		]
		
	};
	
	return map;
}
