// This file shouldn't reach production. It's for debugging. It contains some
// convenient methods, like fixing IE, changing maps, and teleportation.

var debug = true;

// IE requires "file://" prefixed to gameUrl.
// To be safe, don't include this in production code.
var isIe = Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject;
if (isIe && gameUrl.indexOf('http') != 0) {
    gameUrl = "file://" + gameUrl;
}

// Reloads the current map
function reloadMap() {				
    var mapName = Game.currentMap.fileName;
    console.log("Reloading " + mapName);
    loadMap(mapName);
}

// Reloads a new map. eg. loadMap("house1")
function loadMap(mapName) {
    reload("data/maps/" + mapName + ".js");
    reload("data/maps/" + mapName + "_tiles.js");
    reload("data/maps/" + mapName + "_tileset.js");
    // Not sure why, but the function doesn't re-evaluate
    // to the new value until this function call ends.
    // (eg. worldMap()) -- changing maps works though.
    setTimeout(function() {
        Game.showMap(mapName);
        Game.player.move(3, 3);
    }, 10);				
}

// private method
// MOAR debugz: reload scripts on-the-fly
// http://stackoverflow.com/questions/5285006/is-there-a-way-to-refresh-just-the-javascript-include-while-doing-development			
function reload(file) {
    // Delete old instances first
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        if (s.src.indexOf(file) !== -1) {
            document.getElementsByTagName('head')[0].removeChild(s);
        }
    }
                            
    var scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = file + '?' + (new Date).getTime();
    document.getElementsByTagName('head')[0].appendChild(scriptElement);				
}

document.getElementById("cr-stage").addEventListener('click', function(e) {
	var c = Crafty;
	if (typeof(c) !== 'undefined') {
		// Local (veiw) coordinate space
		var local = { x: e.x, y: e.y };
		// Camera coordinate space
		var camera = { x: -Crafty.viewport.x, y: -Crafty.viewport.y };		
		var world = { x: local.x + camera.x, y: local.y + camera.y };
		Crafty('Player').attr({ x: world.x, y: world.y });
	}
});
