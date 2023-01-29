const {currentYear} = require('../../../common/constants');
const Joi = require('joi');

const albumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear).required(),
});

module.exports = {albumPayloadSchema};
