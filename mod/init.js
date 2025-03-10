
import { setupOptions } from './options/options-helpers.js';
import { showHexGridsOption, showYieldsOption } from './options/options.js';

// Add a dependency on the Options module to ensure default options are loaded before the mod's
import '/core/ui/options/options.js';

setupOptions([showHexGridsOption, showYieldsOption]);