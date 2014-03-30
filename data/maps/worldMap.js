function worldMap() {
	var map = {		
		width:  30,
		height: 20,
		
		tile: {
			width:  32,
			height: 32
		},
		
		background: 'world_grass',
		
		audio: 'outside',		
		perimeter: 'world_wall',
		
		objects: [
			{
				type: 'Npc',
				sprite: 'sprite_npc2',
				messages: [[ { text: 'Do you like apples?', character: 'old man' },  {
					avatar: "assets/images/old-man-avatar.png",
					text: "Well? Speak up!",
					choices: ['Yes', 'No'],
					responses: [
						{ text: 'Me too!', character: 'old man' },
						{ text: 'Oh, really? Hmm.', character: 'old man' }
					]
				} ]],
				x: 21, y: 11
			},
			{
				type: '2D',
				components: 'Actor, Interactive',
				sprite: 'sprite_mushroom',
				x: 2, y: 1,				
				messages: [
					[{ text: '... A mushroom? Growing here, near the borders of the town? ... Hmm ...', character: 'hero' },
					"Mushroom: BITE ME!",
					{ text: '?!', character: 'hero' }]
				],
				initialize: function(me, player) {					
					me.interact = me.talk;
				}
			},
			{
				type: 'WalkingNpc',
				sprite: 'sprite_npc1',				
				x: 18, y: 11,
				velocity: { x: 90, y: 0 },
				onTalk: function() {
					var store = new SessionStore();
					var times = store.get('times_talked');
					if (times == null) {
						times = { times: 0 };
					}
					times.times += 1;
					
					//Crafty('PointsManager').trigger('PointsEvent', { event: "Socialized", points: 1 });
					Crafty('PointsManager').event("Socialized", 1);
					
					store.set('times_talked', times);
					return 'You talked to me ' + times.times + ' times!';
				}
			},
			{
				type: 'Npc',
				sprite: 'sprite_chicken_white',				
				x: 18, y: 18,	
				components: 'PositionalAudio',				
				initialize: function(me, player) {
					me.audio('chicken', 5, player);
					me.play();
				}
			},
			{
				type: 'Npc',
				sprite: 'sprite_chicken_red',				
				x: 20, y: 15,	
				components: 'PositionalAudio',				
				initialize: function(me, player) {
					me.audio('chicken2', 5, player);
					me.play();
				}
			},
			{
				range: { start: { x: 6, y: 10 }, end: { x: 16, y: 14 } },
				type: '2D, Actor, Solid, world_tree'
			},
			{
				range: { start: { x: 6, y: 15 }, end: { x: 10, y: 15 } },
				type: '2D, Actor, Solid, world_tree'
			},
			{
				range: { start: { x: 12, y: 15 }, end: { x: 16, y: 15 } },
				type: '2D, Actor, Solid, world_tree'
			},
			{
				type: 'Door',				
				x: 11,
				y: 15,
				initialize: function(me, player) {
					me.transitionsTo('house1', 3, 3);					
				}
			}
		]
	};
	
	return map;
}
