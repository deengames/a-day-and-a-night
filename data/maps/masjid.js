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
				x: 6, y: 5,
				messages: [ "Peace!" ]				
			},
			{
				type: 'Npc',
				x: 19, y: 2,
				sprite: 'sprite_npc3',
				messages: [
					["That statue ... can it see me?", "Can it hear me?", "Hmm ..."],
					"That old man put the statue in the masjid a few days ago. It caused quite a ruckus."
				]
			},
			{
				type: 'StandingNpc',
				x: 4, y: 4,
				sprite: 'student_1',
				messages: ["I've been studying with this shaykh for five years now."]
			},
			{
				type: 'StandingNpc',
				x: 4, y: 6,
				sprite: 'student_2',
				messages: ["I like what he's teaching."]
			},
			{
				type: 'StandingNpc',
				x: 18, y: 2,
				messages: [
					["A beautiful, glittering gold statue of the king stands in front of you -- regal, proud, strong.", 
						{ 
							text: "Offer a quick prayer to the king?", 
							choices: ["Yes", "No"], responses: [
								["You bow your head to the statue and silently pray to the king to protect you from his soldiers.", "Nothing happens."],
								"You glance at status of the vile king and wonder how his presence (and worship) reached even this remote village."
							]
						}
					]
				],				
				initialize: function(me, player) {
					me.disableCollisionCheck();
				},				
				onChoice: function(choice) {
					if (choice == 'Yes') {
						Crafty('PointsManager').event("Worship a piece of gold", -100);
					} else if (choice == 'No') {
						Crafty('PointsManager').event("Decide not to worship the statue", 100);
					}
				}
			},
			{
				type: 'Npc',
				x: 5, y: 11,
				sprite: 'statue_worshipper',
				messages: ["We must follow the way of our ancestors, and pray to the king to help us!"]
			},
		]
		
	};
	
	return map;
}
