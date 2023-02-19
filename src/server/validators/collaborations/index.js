const InvariantError = require(
    '../../../common/errors/subClasses/InvariantError');
const {collaborationsPayloadSchema} = require('./schema');

const CollaborationsValidator = {
  validatePayload: (payload) => {
    const validationResult = collaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
