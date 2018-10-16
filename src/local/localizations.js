/**
 * @file Localization auto-loader
 * More info: README.md -> Localization
 *
 * Export a structure of languages:
 * {
 *    "en" : {...},
 *    "de" : {...},
 *    ...
 * }
 */

const localizations = {};

const imporLocalizations = (files) => {
   files.keys().forEach((file) => {
      const keyName = file.split('/')[1].split('.')[0];
      localizations[keyName] = files(file);
   });
};

imporLocalizations(require.context('./localization', true, /\.json$/));

module.exports = localizations;
