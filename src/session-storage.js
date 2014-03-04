// TODO: turn this into a JS library
// Gives you session-scope storage. Expires when you close your window.
function SessionStore() {
	
	if (typeof(Storage) === 'undefined') {
		alert("Your browser doesn't support Web Storage; please update to the latest version or a different browser. The game may not function properly.");
	}
	
	this.storage = sessionStorage;
}

SessionStore.prototype.get = function(key) {
	var obj = JSON.parse(this.storage.getItem(key));
	return obj;
}

SessionStore.prototype.set = function(key, value) {
	var obj = JSON.stringify(value);
	this.storage.setItem(key, obj);
}

SessionStore.prototype.remove = function(key) {
	this.storage.removeItem(key);
}
