/**
 * @module Storage
 * @description
 * Provide access to user OS application data folder. <br>
 * `%APPDATA%` on Windows <br>
 * `$XDG_CONFIG_HOME` or `~/.config` on Linux <br>
 * `~/Library/Application Support/` on macOS
 *
 * Storage exists -> Load it.
 * Strorage does not exist -> Create.
 */

const electron = require('electron');
const path = require('path');
const fs = require('fs');

const log = require('Modules/logger.app.module');
const error = require('Modules/error.module.js');


class Storage {
   /**
    * @summary Create new file in the `userData` directory and save data permanently.
    * @description Desc
    * @class
    *
    * @param {string} filename - Filename of the storage
    * @param {object} initData - Default data
    *
    * @example <caption>Read & Write to ./config.json</caption>
    * const Storage = _require.module("storage.module");
    * const config = new Storage("config", {name : "Default Name"});  // create or load file
    * config.setData("quantity", 42);                                 // save file
    * config.getData("quantity");                                     // return 42
    */
   constructor(filename, initData = {}) {
      const userData = (electron.app || electron.remote.app).getPath('userData');
      this._filename = filename;
      this._path = path.join(userData, `${filename}.json`);
      this._data = this._parseData(initData);
   }

   /**
    * Get data from the storage file
    * @returns {(object|string|number)} Data
    */
   getData(key) {
      if (this._data[key] === undefined) throw new error.StorageError(this._filename, key);

      return this._data[key];
   }

   /**
    * Save data into the storage file
    * @param {string} key - Key
    * @param {(object|string|number)} value - Value
    */
   setData(key, value) {
      this._data[key] = value;
      try {
         fs.writeFileSync(this._path, JSON.stringify(this._data));
      } catch (e) {
         log.error(e.message);
      }

      return value;
   }

   /**
    * Parse data prom the storage or create new
    * @param file - A storage file
    * @param data - Default data from the constructor
    * @returns {object} - Parsed data
    * @private
    */
   _parseData(data) {
      // The storage file may not exist, no need to catch errors
      try {
         return JSON.parse(fs.readFileSync(this._path).toString());
      } catch (e) {
         return data;
      }
   }
}

module.exports = Storage;
