const InvariantError = require(
    '../../../common/errors/subClasses/InvariantError');
const Schemas = require('./schema');

const AlbumsValidator = {
  validatePostAlbumPayload: (payload) => {
    const validationResult = Schemas.albumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostAlbumCoverHeader: (header) => {
    const validationResult = Schemas.imageHeadersSchema.validate(header);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
