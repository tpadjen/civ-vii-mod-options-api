export class JSONStore {

    static #LOCAL_STORAGE_KEY = "modSettings";
    
    constructor(namespace = 'default') {
        this.namespace = namespace;
    }

    setItem(key, value) {
        if (localStorage.length > 1) {
            console.warn(`Invalid localStorage: Found (${localStorage.length} keys, only 1 allowed)`);
            const invalidKeys = (Object.keys(localStorage) ?? [])
                                    .filter(key => key !== JSONStore.#LOCAL_STORAGE_KEY);
            if (invalidKeys.length > 0) console.warn('Invalid keys: ', JSON.stringify(invalidKeys));
            console.warn(`Mods should only write data to "${JSONStore.#LOCAL_STORAGE_KEY}"`);
            console.warn('Clearing all localStorage data to allow continued usage');

            localStorage.clear();
        }

        const store = this.#readStore();
        const namespaceStore = store[this.namespace] ?? {}; 
        const updated = {
            ...store,
            [this.namespace]: {
                ...namespaceStore,
                [key]: value
            }
        }
        this.#writeStore(updated);
    }

    getItem(key) {
        const store = this.#readStore();
        const namespaceStore = store[this.namespace] ?? {};
        return namespaceStore[key];
    }

    clear() {
        const store = this.#readStore();
        delete store[this.namespace];
        this.#writeStore(store);
    }

    #readStore() {
        return JSON.parse(localStorage.getItem(JSONStore.#LOCAL_STORAGE_KEY))
    }

    #writeStore(store) {
        localStorage.setItem(JSONStore.#LOCAL_STORAGE_KEY, JSON.stringify(store));
    }
}