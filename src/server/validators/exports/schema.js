const Joi = require('joi');

const PostPlaylistsSchema = Joi.object({
  targetEmail: Joi.string().email({tlds: true}).required(),
});

module.exports = {PostPlaylistsSchema};
