const DB_NAME = 'ChatTPG';
const DB_VERSION = 1;
const STORE_NAME = 'chats';

export function Prompt(message, response) {
    this.message = message;
    this.response = response;
    this.timestamp = new Date().toISOString();
}

function ChatHistory(prompts, model) {
    this.prompts = prompts;
    this.model = model;
    this.timestamp = new Date().toISOString(); // last updated
}

let db = null;

export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB: ", event.target.error);
            reject("Failed to open database");
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const tempDb = event.target.result;

            if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
                tempDb.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true,
                });
            }
        };
    });
}

export function createItem(prompts, model) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("Database not initialized");
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);

        const newItem = new ChatHistory(prompts, model);
        const request = objectStore.add(newItem);

        request.onsuccess = (event) => {
            const addedItemWithId = {...newItem, id: event.target.result};
            console.log("Item added:", addedItemWithId);
            resolve(addedItemWithId);
        };

        request.onerror = (event) => {
            console.error("Error adding item:", event.target.error);
            reject("Failed to add item: " + event.target.error.message);
        };
    });
}

export function updateChat(updatedChat) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("Database not initialized");
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);

        //updating timestamp
        updateChat.timestamp = new Date().toISOString();

        const item = objectStore.put(updatedChat);
        item.onsuccess = (event) => {
            console.log("Item updated:", updatedChat);
            resolve(updatedChat);
        };

        item.onerror = (event) => {
            console.error("Error updating item:", event.target.error);
            reject("Failed to update item: " + event.target.error.message);
        }
    });
}

export function getItems() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("Database not initialized");
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);

        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            const items = event.target.result;

            items.sort((a, b) => {
                if (a.timestamp < b.timestamp) return 1;
                if (a.timestamp > b.timestamp) return -1;
                return 0;
            })
            console.log("Items retrieved:", items);
            resolve(items);
        };

        request.onerror = (event) => {
            console.error("Error getting items:", event.target.error);
            reject("Failed to retrieve items: " + event.target.error.message);
        };
    });
}
