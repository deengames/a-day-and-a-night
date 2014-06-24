// TODO: turn this into a JS library
// Gives you persistent storage. If it's not available, uses session storage.
function PersistentStore(dbName) {
	
	var indexedDb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	this.useSessionStore = (indexedDb == null);
	
	if (this.useSessionStore) {
		if (typeof(Storage) !== 'undefined') {
			alert("Your browser doesn't support IndexedDB; please update to the latest version or a different browser. Save data will be deleted if you close the window.");
			this.storage = sessionStorage;
		} else {
			alert("Your browser doesn't support IndexedDB or Web Storage; please update to the latest version or a different browser. The game may not function properly.");
		}
	} else {
		this.storage = new PouchDB(dbName);	
	}
}

PersistentStore.prototype.get = function(key, callback) {
	if (!this.useSessionStore) {
		this.storage.get(key, function(error, doc) {
			if (error) {
				// Key is not in the store
				if (error.status == 404) {
					callback(null);
				} else {
					throw new Error("Error getting key " + key + ": "  + error);
				}
			} else {
				callback(doc);
			}
		});
	} else {
		var obj = JSON.parse(sessionStorage.getItem(key));
		callback(obj);
	}
}

PersistentStore.prototype.set = function(key, value) {
	if (value != null) {
		if (!this.useSessionStore) {		
			value._id = key;			
			this.storage.put(value, function(error, value) {
				if (error) {
					throw new Error("Error setting key " + key + ": "  + error);
				} 
			});
		} else {
			var obj = JSON.stringify(value);
			sessionStorage.setItem(key, obj);
		}
	}
}

PersistentStore.prototype.remove = function(key) {
	if (!this.useSessionStore) {
		this.value._id = key;
		this.storage.remove(key, function(error, response) {
			if (error) {
				throw new Error("Error setting key " + key + " to " + value + ": "  + error);
			} 
		});
	} else {
		sessionStorage.removeItem(key);
	}
}
