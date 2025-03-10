const LOCAL_STORAGE_KEY = 'tbq-show-layers-on-start';

function readSettings() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
}

function writeSettings(newSettings) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings))
}

export const ModOptionsStorage = {
    load(modOption) {
        const settings = readSettings();
        return settings ? settings[modOption.id] : modOption.defaultValue;
    },
    save(modOptions) {
        const oldSettings = readSettings() ?? {};
        let newSettings = {
            ...oldSettings,
        };
        modOptions.forEach(modOption => newSettings[modOption.id] = modOption.updatedValue);
        writeSettings(newSettings);
    },
    setDefaultsIfEmpty(modOptions) {
        if (!readSettings()) this.resetToDefaults(modOptions);
    },
    resetToDefaults(modOptions) {
        const defaultSettings = {};
        modOptions.forEach(setting => defaultSettings[setting.id] = setting.defaultValue);
        writeSettings(defaultSettings);
    },
    restore(modOptions) {},
    clear() {
        localStorage.setItem(LOCAL_STORAGE_KEY, null);
    }
}
