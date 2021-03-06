const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} sucks!'
};

const userSchema = new Schema({

    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, unique: true, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    img: { type: String },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },

});

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);