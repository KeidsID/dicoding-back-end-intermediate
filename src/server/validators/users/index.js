const InvariantError = require(
    '../../../common/errors/subClasses/InvariantError');
const {UsersPayloadSchema} = require('./schema');

const UsersValidator = {
  validatePayload: (payload) => {
    const validationResult = UsersPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
