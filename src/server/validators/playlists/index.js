const InvariantError = require('../../../common/errors/InvariantError');
const Schemas = require('./schema');

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = Schemas.
        PostPlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostPlaylistsSongsPayload: (payload) => {
    const validationResult = Schemas.
        PostPlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
