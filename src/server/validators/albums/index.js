const InvariantError = require('../../../common/errors/InvariantError');
const {albumPayloadSchema} = require('./schema');

const AlbumsValidator = {
  validatePayload: (payload) => {
    const validationResult = albumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
