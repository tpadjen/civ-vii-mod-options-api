# Options API

A Civ VII api that add functionality to the built in Options model to make adding settings options for other mods easier.

## Installation Instructions
1. You can download the latest stable release from this repo's releases)
2. Extract to the corresponding mods folder
    * Windows: `%localappdata%\Firaxis Games\Sid Meier's Civilization VII\Mods`
    * MacOS: `~/Library/Application Support/Civilization VII/Mods`
    * Steam Deck\Linux: `~/My Games/Sid Meier's Civilization VII/Mods/`

## Usage
1. Copy the file `[mod-id]-options-api.js` from the api folder to anywhere in your mod.
2. Rename `[mod-id]-options-api.js` by replacing `[mod-id]` with a unique id for your mod.
2. Add the files to your `modinfo` as `ImportFiles`
```
// inside an Action
<ImportFiles>
    <Item>path/to/your-id-options-api.js</Item>
</ImportFiles>
```
3. Create a new js, as an ImportFile (so it can export to other ImportFiles), example `your-id-mod-options.js`
```
import { setupModOptions } from '/path/to/your-id-options-api.js';
import { Options, OptionType } from "/core/ui/options/model-options.js";
import { CategoryType } from '/core/ui/options/options-helpers.js';

// needs to load before adding new options to Mods category
import '/core/ui/options/options.js';

// namespace must be unique for your mod to prevent conflicts
const ModOptions = setupModOptions({ namespace: 'tbq-csl' });

// the name of the settings group to put this in, matched to a localization key
const MOD_OPTIONS_GROUP = 'snake_case_name_to_match_loc_group';

// 'addModOption' has been added to the Options model by this mod.
// It handles all of the heavy lifting
//   * registering the option with the ui
//   * setting initial values
//   * reading and writing data using localStorage (without overwriting other mod's data - 
//       given a proper unique namespace)
//   * restoring cancelled settings changes
//   * resetting to default values
//
// It returns an object with all of these properties, plus
//   * value - the current value of option
//   * addChangeListener((value) => void) - listen for changes to the value
export const myFirstOption = ModOptions.addModOption({
    id: 'my-first-option',        // internal use, unique within your namespace
    category: CategoryType.Mods,  // which tab should it show up in (Mods recommended)?
    group: MOD_OPTIONS_GROUP,     // which group should it be in?
    type: OptionType.Checkbox,    // what type of option is it (API only tested with checkbox for now)
    defaultValue: true,           // what should the initial value be?
    label: "LOC_MOD_ABC_MY_FIRST_OPTION",            // loc key for label in the ui
    description: "LOC_MOD_ABC_MY_FIRST_OPTION_DESC", // loca key for hover text description
});
```
4. Import the option in a UI script to load it properly, example `init.js`
```
import { myFirstOption } from "./mod-options.js";

// use it here if you need
```
5. Import the option in another ImportFile that overwrites a core game file (if necessary)
```
import { myFirstOption } from "./mod-options.js";

// Access the value directly
if (myfirstOption.value) // do something useful

// Or listen for changes
myFirstOption.addChangeListener((value) => {
    // perform ui updates
});
```