const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const { type } = require('os');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    maxlength: [50, 'A name must have less or equal than 50 characters'],
    minlength: [5, 'A name must have more or equal than 5 characters'],
    // validate: [validator.isAlpha, 'Name must only contain characters'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'A password must have more or equal than 8 characters'],
    // This field will not be sent in the response
    select: false, // It will not be included in the results
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // Check if the password has been modified
  if (!this.isModified('password')) {
    return next(); // Skip the rest of the function if the password hasn't been modified
  }

  // Hash the password with a salt rounds of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Remove the passwordConfirm field from the document
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  //this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Define a method to compare the candidate password with the hashed password
// Returns true if the passwords match, false otherwise
// This method is called on an instance of the user model
userSchema.methods.correctPassword = async function (
  candidatePassword, // The password entered by the user
  userPassword, // The hashed password stored in the user model
) {
  // Compare the candidate password with the hashed password using bcrypt
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp; // 100 < 200
  }

  //False means Not changed
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // expires in 10 minutes from now
  // 10 * 60 * 1000 = 600000 milliseconds in 10 minutes
  // Date.now() returns the current timestamp in milliseconds
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
