const InvariantError = require('../../../common/errors/InvariantError');
const {usersSchema} = require('./schema');

const UsersValidator = {
  validatePayload: (payload) => {
    const validationResult = usersSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
