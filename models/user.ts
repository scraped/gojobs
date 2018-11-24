import {Schema, Document, Model, model} from 'mongoose';
import random from 'lodash/random';
import bcrypt from 'bcrypt';

export interface IUserModel extends Document {
  username: string;
  rgscUserId: number;
  crew?: string;
  role: string;
  verified: boolean;
  verifyDate?: Date;
  password: string;
  email?: string;
  checkPassword: (password: string) => boolean;
}

export enum userRoles {
  Admin = 'admin',
  Moderator = 'mod',
  User = 'user',
}

function isVerified() {
  return this.verified;
}

function setPassword(password: string) {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
}

const {validateFn} = require('../validators');

const usernameValidator = validateFn('username');

const schema: Schema = new Schema({
  username: {
    type: String,
    validate: usernameValidator,
    unique: true,
    required: true,
  },

  userId: {
    type: Number,
    unique: true,
    required: true,
  },

  crew: {
    type: String,
  },

  role: {
    type: String,
    enum: userRoles,
    required() {
      return this.verified;
    },
  },

  verified: {
    type: Boolean,
  },

  verifyDate: {
    type: Date,
    required: isVerified,
  },

  password: {
    type: String,
    set: setPassword,
    required: isVerified,
  },

  email: {
    type: String,
  },
},
{
  id: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toObject: {
    versionKey: false,
  },
});

schema.methods.checkPassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

schema.statics.generateTestJobName = function () {
  const values = 'abcdefghijklmnopqrstuvwxyz';
  const VALUES_NUMBER = values.length;
  const NAME_LENGTH = 18;

  let jobNameArray = [];

  for (let i = 0; i < NAME_LENGTH; i++) {
    jobNameArray[i] = values[random(0, VALUES_NUMBER - 1)];
  }

  return jobNameArray.join('');
};

export const User: Model<IUserModel> = model<IUserModel>('User', schema);
