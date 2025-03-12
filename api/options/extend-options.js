import { JSONStore } from "../storage/json-store.js";
import { OptionsStore } from "./options-store.js";
import { Options } from "/core/ui/options/model-options.js";

function extendOptions() {
    const proto = Object.getPrototypeOf(Options);

    // commit options when user clicks save
    const commitOptions = proto.commitOptions;
    proto.commitOptions = function(...args) {
        commitOptions.apply(this, args);
        this.optionsStore?.commitOptions();
    }

    const resetOptionsToDefault = proto.resetOptionsToDefault;
    proto.resetOptionsToDefault = function(...args) {
        resetOptionsToDefault.apply(this, args);
        this.optionsStore?.resetToDefaults();
    }

    // user cancelled options changes, restore to previous values
    const restore = proto.restore;
    proto.restore = function(...args) {
        restore.apply(this, args);
        this.optionsStore?.restore();
    }

    proto.setupModOptions = function({ namespace, settingsKey }) {
        this.dataStore = new JSONStore(namespace ?? 'default');
        this.optionsStore = new OptionsStore(this.dataStore, settingsKey ?? 'settings');
    }

    proto.addModOption = function(modOption) {
        const newOption = {
            ...modOption,
            initListener(optionInfo) {
                optionInfo.currentValue = this.value;
                this.updatedValue = this.value;
            },
            updateListener(optionInfo, value) {
                optionInfo.currentValue = value;
                this.updatedValue = optionInfo.currentValue;
            },
            _changeListeners: [],
            addChangeListener(callback) {
                this._changeListeners.push(callback);
            },
            removeChangeListener(callback) { 
                this._changeListeners = this.changeListeners.filter(cb => cb !== callback)
            },
            onChange(value) {
                this._changeListeners.forEach(callback => callback(value))
            }
        };

        this.optionsStore?.addOption(newOption);
        this.addInitCallback(() => Options.addOption(newOption));

        return newOption;
    }
}

extendOptions();