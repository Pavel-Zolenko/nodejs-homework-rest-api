const { RequestError } = require('../helpers');

const validateBody = schema => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            next(RequestError(400, error.message));
        }
        next();
    }
    return func;
};


const updateValidation = (schema) => {
  return (req, res, next) => {
    const { name, phone, email } = req.body;
    const { error } = schema.validate(req.body);
    const noBody = !name && !phone && !email;
    if (error || noBody) {
      if (noBody) {
        const error = RequestError(400, "Missing fields");
        next(error);
        return;
      }
      error.status = 400;
      next(error);
      return;
    }

    next();
  };
};

module.exports = {
    validateBody,
    updateValidation,
};