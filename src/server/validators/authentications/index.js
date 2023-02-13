const InvariantError = require('../../../common/errors/InvariantError');
const Schemas = require('./schema');

const AuthenticationsValidator = {
  validatePostPayload: (payload) => {
    const validationResult = Schemas.PostPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutPayload: (payload) => {
    const validationResult = Schemas.PutPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeletePayload: (payload) => {
    const validationResult = Schemas.DeletePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
