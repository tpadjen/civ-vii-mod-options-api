import { Options, OptionType } from '/core/ui/options/model-options.js';
import { ModOptionsStorage } from './storage.js';

export const buildCheckboxOption = (modOption) => {
    return {
        ...modOption,
        type: OptionType.Checkbox,
        initListener(optionInfo) {
            optionInfo.currentValue = ModOptionsStorage.load(modOption);
            this.value = optionInfo.currentValue;
            this.updatedValue = this.value;
        },
        updateListener(optionInfo, value) {
            optionInfo.currentValue = value;
            this.updatedValue = optionInfo.currentValue;
        },
        value: ModOptionsStorage.load(modOption),
    }
}

export function setupOptions(modOptions) {
    const proto = Object.getPrototypeOf(Options);

    // commit options when user clicks save
    const commitOptions = proto.commitOptions;
    proto.commitOptions = function(...args) {
        commitOptions.apply(this, args);
        ModOptionsStorage.save(modOptions);
    }

    const resetOptionsToDefault = proto.resetOptionsToDefault;
    proto.resetOptionsToDefault = function(...args) {
        resetOptionsToDefault.apply(this, args);
        ModOptionsStorage.resetToDefaults(modOptions);
    }

    // user cancelled options changes, reset to previous values
    const restore = proto.restore;
    proto.restore = function(...args) {
        restore.apply(this, args);
        ModOptionsStorage.restore(modOptions);
    }

    ModOptionsStorage.setDefaultsIfEmpty(modOptions);

    // Add options to the game's menu
    Options.addInitCallback(() => modOptions.forEach(modOption => Options.addOption(modOption)));
}