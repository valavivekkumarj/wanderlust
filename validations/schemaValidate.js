const joi=require('joi');
const reviews = require('../models/db/reviewsModel');
//validate all listings schema:
module.exports.validateSchema=joi.object({
    formdata:joi.object({
        title:joi.string().required(),
        image:joi.string().allow("",null),
        description:joi.string().required(),
        price:joi.number().required().min(0),
        location:joi.string().required(),
        country:joi.string().required(),
        category:joi.string()
    }).required()
})

//validate review schemas:
module.exports.validateReview=joi.object({
    review:joi.object({
        ratings:joi.number().min(1).max(5).required(),
        comments:joi.string().required()
    }).required()
});