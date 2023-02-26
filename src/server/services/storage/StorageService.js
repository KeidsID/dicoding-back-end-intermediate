/* eslint-disable no-unused-vars */
const fs = require('fs');

// VsCode-JsDoc purpose
const {Readable} = require('stream');

/**
 * Services for manage file storage.
 */
class StorageService {
  #folderPath;

  /**
   * @param {string} folderPath
   */
  constructor(folderPath) {
    this.#folderPath = folderPath;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }
  }

  /**
   * @param {Readable} file - Stream data from Hapi Server
   * @param {string} id - File identifier to store
   * @param {string} name - File name to store
   *
   * @typedef {object} HapiMeta - From Stream (file param)
   * @property {string} filename
   * @property {object} headers
   *
   * @return {Promise<string>} File name
   */
  writeFile(file, id, name) {
    /**
     * @type {HapiMeta}
     */
    const hapiMeta = file.hapi;
    const fileExtension = hapiMeta.filename.match(/\.[0-9a-z]+$/i)[0];
    const filename = `${id}_${name}${fileExtension}`;
    const path = `${this.#folderPath}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));

      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
