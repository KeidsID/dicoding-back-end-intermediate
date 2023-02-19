const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostPlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().max(50).required(),
});

const DeletePlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().max(50).required(),
});

module.exports = {
  PostPlaylistsPayloadSchema, PostPlaylistSongsPayloadSchema,
  DeletePlaylistSongsPayloadSchema,
};
