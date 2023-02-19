const Joi = require('joi');

const collaborationsPayloadSchema = Joi.object({
  playlistId: Joi.string().max(50).required(),
  userId: Joi.string().max(50).required(),
});

module.exports = {collaborationsPayloadSchema};
