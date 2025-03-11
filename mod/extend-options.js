import { ModOptionsStore } from "./mod-options-store.js";
import { Options } from "/core/ui/options/model-options.js";

function extendOptions() {
    const proto = Object.getPrototypeOf(Options);

    // commit options when user clicks save
    const commitOptions = proto.commitOptions;
    proto.commitOptions = function(...args) {
        commitOptions.apply(this, args);
        ModOptionsStore.commitOptions();
    }

    const resetOptionsToDefault = proto.resetOptionsToDefault;
    proto.resetOptionsToDefault = function(...args) {
        resetOptionsToDefault.apply(this, args);
        ModOptionsStore.resetToDefaults();
    }

    // user cancelled options changes, restore to previous values
    const restore = proto.restore;
    proto.restore = function(...args) {
        restore.apply(this, args);
        ModOptionsStore.restore();
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

        ModOptionsStore.addModOption(newOption);
        this.addInitCallback(() => Options.addOption(newOption));

        return newOption;
    }
}

extendOptions();