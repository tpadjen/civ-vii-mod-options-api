import { JSONStore } from "../storage/json-store.js";
import { OptionsStore } from "./options-store.js";
import { Options } from "/core/ui/options/model-options.js";
import { CategoryData, CategoryType } from '/core/ui/options/options-helpers.js';

export function extendOptions({ namespace, settingsKey }) {
    const dataStore = new JSONStore(namespace ?? 'default');
    const optionsStore = new OptionsStore(dataStore, settingsKey ?? 'settings');

    CategoryType["Mods"] = "mods";
    CategoryData[CategoryType.Mods] = {
        title: "LOC_UI_CONTENT_MGR_SUBTITLE",
        description: "LOC_UI_CONTENT_MGR_SUBTITLE_DESCRIPTION",
    };

    const proto = Object.getPrototypeOf(Options);

    // commit options when user clicks save
    const commitOptions = proto.commitOptions;
    proto.commitOptions = function(...args) {
        commitOptions.apply(this, args);
        optionsStore?.commitOptions();
    }

    const resetOptionsToDefault = proto.resetOptionsToDefault;
    proto.resetOptionsToDefault = function(...args) {
        resetOptionsToDefault.apply(this, args);
        optionsStore?.resetToDefaults();
    }

    // user cancelled options changes, restore to previous values
    const restore = proto.restore;
    proto.restore = function(...args) {
        restore.apply(this, args);
        optionsStore?.restore();
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

        optionsStore?.addOption(newOption);
        this.addInitCallback(() => Options.addOption(newOption));

        return newOption;
    }
}
