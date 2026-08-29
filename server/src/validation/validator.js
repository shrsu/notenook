function validateData(data, schema) {
  const result = schema.validate(data, { abortEarly: false });
  return result;
}

module.exports = { validateData };
