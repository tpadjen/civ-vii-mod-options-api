const LOCAL_STORAGE_KEY = "modSettings";

function readSettings() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
}

function writeSettings(newSettings) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings))
}

export const ModOptionsStore = {
    namespace: 'default',
    modOptions: [],

    addModOption(modOption) {
        this.modOption = this.modOptions.push(modOption);
        this.setDefaultsForMissingOptions([modOption]);
        modOption.value = this.load(modOption);
    },
    load(modOption) {
        const settings = readSettings();
        return settings && settings[modOption.namespace] 
            ? settings[modOption.namespace][modOption.id] 
            : modOption.defaultValue;
    },
    commitOptions() {
        const oldSettings = readSettings() ?? {};
        let newSettings = {
            ...oldSettings,
        };

        const updatedOptions = this.modOptions.filter(modOption => modOption.updatedValue !== modOption.value);

        this.modOptions.forEach(modOption => newSettings[modOption.namespace] = { 
            ...(newSettings?.[modOption.namespace] ?? {}), 
            [modOption.id]: modOption.updatedValue
        });
            
        writeSettings(newSettings);

        updatedOptions.forEach(modOption => modOption.value = modOption.updatedValue);
        updatedOptions.forEach(modOption => modOption.onChange(modOption.value));
    },
    setDefaultsForMissingOptions(modOptions) {
        const existingSettings = readSettings() ?? {};
        const newSettings = {};
        modOptions.forEach(modOption => newSettings[modOption.namespace] = { 
            ...(newSettings?.[this.namespace] ?? {}), 
            [modOption.id]: modOption.defaultValue
        });
        
        // only write a default if the existing settings did not include the given option 
        writeSettings({
            ...newSettings,
            ...existingSettings
        });
    },
    resetToDefaults() {
        const defaultSettings = readSettings() ?? {};
        const newSettings = {};
        this.modOptions.forEach(modOption => newSettings[modOption.namespace] = { 
            ...(newSettings?.[this.namespace] ?? {}), 
            [modOption.id]: modOption.defaultValue
        });

        const updatedOptions = this.modOptions.filter(modOption => modOption.value !== modOption.defaultValue);
        
        // leave other settings intact, but overwrite any loaded options with their defaults
        writeSettings({
            ...defaultSettings,
            ...newSettings
        });

        updatedOptions.forEach(modOption => modOption.value = modOption.defaultValue);
        updatedOptions.forEach(modOption => modOption.onChange(modOption.value));
    },
    restore() {
        this.modOptions.forEach(modOption => modOption.updatedValue = modOption.value);
    },
    clear() {
        localStorage.setItem(LOCAL_STORAGE_KEY, null);
    }
}
