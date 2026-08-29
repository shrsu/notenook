const Joi = require("joi");

const newNoteJoiSchema = Joi.object({
  title: Joi.string().required().min(3),
  subject: Joi.string().required().min(3),
});

const updateNoteJoiSchema = Joi.object({
  title: Joi.string().required().min(3),
  subject: Joi.string().required().min(3),
  fileReference: Joi.object({
    fileName: Joi.string().required(),
    url: Joi.string().uri().required(),
  }).optional(),
});

const updateNoteFileReferenceJoiSchema = Joi.object({
  noteId: Joi.string().required(),
  fileName: Joi.string().required(),
  url: Joi.string().uri().required(),
});

module.exports = {
  newNoteJoiSchema,
  updateNoteJoiSchema,
  updateNoteFileReferenceJoiSchema,
};