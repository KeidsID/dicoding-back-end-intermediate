const {currentYear} = require('../../../common/constants');
const Joi = require('joi');

const songPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().positive(),
  albumId: Joi.string().max(50),
});

module.exports = {songPayloadSchema};
