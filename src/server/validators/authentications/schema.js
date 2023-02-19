const Joi = require('joi');

const PostPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
});

const PutPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeletePayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {PostPayloadSchema, PutPayloadSchema, DeletePayloadSchema};
