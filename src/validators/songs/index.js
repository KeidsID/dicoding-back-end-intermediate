const InvariantError = require('../../common/errors/InvariantError');
const {songPayloadSchema} = require('./schema');

const SongsValidator = {
  validatePayload: (payload) => {
    const validationResult = songPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
