const {nanoid} = require('nanoid');

const InvariantError = require('../common/errors/InvariantError');
const NotFoundError = require('../common/errors/NotFoundError');

/**
 * CRUD Service for Albums handling.
 */
class AlbumsService {
  /**
  * CRUD Service for Albums handling.
  */
  constructor() {
    this._albums = [];
  }

  /**
   * Create and add Album object to memory.
   *
   * @param {object} payload - Body request from Client.
   * @param {string} payload.name
   * @param {number} payload.year
   *
   * @throws {InvariantError} Type of Error that may be thrown.
   * @return {string} The unique Id of the new Album.
   *
   */
  addAlbum({name, year}) {
    const id = `album-${nanoid(16)}`;

    const newAlbum = {id, name, year};

    this._albums.push(newAlbum);

    const isAdded = this._albums.filter((e) => e.id === id).length > 0;

    if (!isAdded) {
      throw new InvariantError('Failed to add album');
    }

    return id;
  }

  /**
   * Get Album object from memory based on the requested id.
   *
   * @param {string} id - The id from endpoint.
   *
   * @throws {NotFoundError} Type of Error that may be thrown.
   * @return {object} The Album object based on Id.
   */
  getAlbumById(id) {
    const album = this._albums.filter((e) => e.id === id)[0];

    if (!album) {
      throw new NotFoundError('Album not found');
    }

    return album;
  }

  /**
   * Update Album object from memory based on the requested id with
   * a new value.
   *
   * @param {string} id - The id from endpoint.
   * @param {object} payload - Body request from Client.
   * @param {string} payload.name
   * @param {number} payload.year
   *
   * @throws {NotFoundError} Type of Error that may be thrown.
   */
  editAlbumById(id, {name, year}) {
    const index = this._albums.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new NotFoundError('Failed to update album. Id not found');
    }

    this._albums[index] = {
      ...this._albums[index],
      name, year,
    };
  }

  /**
   * Delete an Album object from memory based on the requested id.
   *
   * @param {string} id - The id from endpoint.
   *
   * @throws {NotFoundError} Type of Error that may be thrown.
   */
  deleteAlbumById(id) {
    const index = this._albums.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new NotFoundError('Failed to delete album. Id not found');
    }

    this._albums.splice(index, 1);
  }
}

module.exports = AlbumsService;
