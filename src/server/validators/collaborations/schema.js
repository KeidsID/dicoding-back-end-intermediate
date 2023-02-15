const Joi = require('joi');

const collaborationsPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {collaborationsPayloadSchema};
