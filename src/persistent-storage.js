// TODO: turn this into a JS library
// Gives you persistent storage. If it's not available, uses session storage.
function PersistentStore(dbName) {
	
	var indexedDb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	this.useSessionStore = (indexedDb == null);
	
	if (this.useSessionStore) {
		alert("Your browser doesn't support IndexedDB; please update to the latest version or a different browser. Save data will be deleted if you refresh or close the window.");
		this.storage = sessionStorage;
	} else {
		this.storage = new PouchDB(dbName);	
	}
}

PersistentStore.prototype.get = function(key, callback) {
	if (!this.useSessionStore) {
		this.storage.get(key, function(error, doc) {
			if (error) {
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
		return sessionStorage.getItem(key);
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
			sessionStorage.setItem(key, value);
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
