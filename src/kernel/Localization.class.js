// Modules
const log = require('Modules/logger.app.module');
const Storage = require('Modules/storage.module');

// Other dependencies
const configLocalization = require('Configs/localization.config');
const localizations = require('Local/localizations');


class Localization {
   /**
    * @summary Create a localization interface
    * @description Provides an interface for all localization requests.
    * @class
    *
    * @returns {Localization} Localization instance
    *
    * @example <caption>Singleton instance in evodoc</caption>
    * evodoc.getLocalization();
    *
    * @example <caption>Get localization file for a route</caption>
    * // FIXME: Rewrite method
    * let object = evodoc.getLocalization().getLocalization();
    *
    * @example <caption>Get Phrase</caption>
    * let pharse = evodoc.getLocalization().getPhrase("namespace", "key");
    */
   constructor() {
      this._localizations = null;
      this._localizationDefault = null;
      this._localizationUser = null;
      this._localizationStorage = null;
   }


   /**
    * @summary Localization initialization
    * @description Loads local localizations (explicitly set in `localizations.js`).
    * Loads and verifies default localization.
    * Loads and verifies user localization from the storage.
    * If the saved localization does not exist, resets user localization to the default
    * (+ storage value).
    */
   init() {
      log.group('Localization Init');

      // Load localizations
      this._localizations = localizations;
      log.trace(`Loaded localizations: ${Object.keys(this._localizations).join(', ')}`);

      // Load default localization
      this._localizationDefault = configLocalization.default;
      log.trace(`Default localization: ${this._localizationDefault}`);

      // Load/Create localization storage
      this._localizationStorage = new Storage('localization', {
         userLocalization: this._localizationDefault,
      });

      // Check if default localization has its file
      if (Object.keys(this._localizations).indexOf(this._localizationDefault) === -1) {
         log.error('Default localization file does not exist.');
      }

      // Load user localization
      try {
         this._localizationUser = this._localizationStorage.getData('userLocalization');
      } catch (e) {
         // This should never happen, user must have userLocalization now
         this._localizationUser = this._localizationStorage.setData(
            'userLocalization',
            this._localizationDefault,
         );
      }
      log.trace(`User localization: ${this._localizationUser}`);

      // Check if user localization exists (± resest to the default)
      if (Object.keys(this._localizations).indexOf(this._localizationUser) === -1) {
         log.warn(`User localization does not exist (${this._localizationUser}).`);
         this._localizationStorage.setData('userLocalization', this._localizationDefault);
         log.warn(`User localization is reset to "${this._localizationDefault}".`);
      }

      log.groupEnd('Localization Init');
   }


   /**
    * @summary Get phrase in user language
    * @description Search for the requested phrase in the current user language.
    * If the phrase does not exist, return its path.
    * @param {string} path - E.g. auth.login.example
    * @param {string} [localization] - Specific localization, e.g. en
    */
   getPhrase(path, localization = null) {
      let fullPath = localization !== null
         ? `${localization}.${path}`
         : `${this._localizationUser}.${path}`;

      fullPath = fullPath.slice(-1) === '.'
         ? fullPath.slice(0, -1)
         : fullPath;

      try {
         return this._serachPhrase(fullPath, fullPath);
      } catch (e) {
         log.error(`Localization: Phrase "${fullPath}" does not exist, failed at "${e}"`);
         return path;
      }
   }


   /**
    * @summary Get phrase group in user language
    * @description The same as getPhrase, but with semantical context.
    * @param {string} path - E.g. auth.login.example
    * @param {string} [localization] - Specific localization, e.g. en
    */
   getPhraseGroup(path, localization = null) {
      return this.getPhrase(path, localization);
   }

   _serachPhrase(pathFull, pathCurrent) {
      const split = pathCurrent.split('.');
      let phrase = this._localizations;

      for (let i = 0; i < split.length; i += 1) {
         const key = split[i];

         if (Object.prototype.hasOwnProperty.call(phrase, key)) {
            phrase = phrase[key];
         } else {
            throw key;
         }
      }

      return phrase;
   }


   /**
    * @summary Changes user localization
    * @description Try to change user language and save it to the storage.
    */
   changeLocalization(localization) {
      // Check language OR set default
      if (!Object.prototype.hasOwnProperty.call(this._localizations, localization)) {
         log.error(`Localization: change failed - "${localization}" not found`);

         return false;
      }

      // Save new language
      this._localizationUser = localization;
      this._localizationStorage.setData('userLocalization', this._localizationUser);

      // Reload page
      // FIXME: Reload
      // evodoc.getRouter().reload();
      return true;
   }
}

module.exports = Localization;
