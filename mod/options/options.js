import { CategoryType } from '/core/ui/options/options-helpers.js';
import { buildCheckboxOption } from './options-helpers.js';

const MOD_GROUP = 'tbq_choose_starting_layers';

export const showHexGridsOption = buildCheckboxOption({
    id: 'show-hexgrids',
    category: CategoryType.Game,
    group: MOD_GROUP,
    defaultValue: true,
    label: "LOC_MOD_CSL_SHOW_HEXGRID_ON_LOAD_OPTION",
    description: "LOC_MOD_CSL_SHOW_HEXGRID_ON_LOAD_OPTION_DESC",
});

export const showYieldsOption = buildCheckboxOption({
    id: 'show-yields',
    category: CategoryType.Game,
    group: MOD_GROUP,
    defaultValue: false,
    label: "LOC_MOD_CSL_SHOW_YIELDS_ON_LOAD_OPTION",
    description: "LOC_MOD_CSL_SHOW_YIELDS_ON_LOAD_OPTION_DESC",
});
