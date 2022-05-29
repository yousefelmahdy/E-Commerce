// Validation
const joi = require('joi');


const passwordValidator = joi.string().min(6).required();
const emailValidator = joi.string().min(6).required().email();


module.exports = {
    passwordValidator: passwordValidator,
    emailValidator: emailValidator,
};
