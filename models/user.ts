import {Typegoose, prop, instanceMethod, InstanceType, staticMethod} from 'typegoose'; import random from 'lodash/random';
import bcrypt from 'bcrypt';

export enum UserRoles {
  Admin = 'admin',
  Moderator = 'mod',
  User = 'user',
}

function isVerified(this: User) {
  return this.verified;
}

class User extends Typegoose {
  @prop({
    unique: true,
    required: true,
  })
  username!: string;

  @prop({
    unique: true,
    required: true,
  })
  rgscUserId!: number;

  @prop()
  crew?: string;

  @prop({
    enum: UserRoles,
    default: UserRoles.User,
    required: true,
  })
  role!: UserRoles;

  @prop()
  verified?: boolean;

  @prop({
    required: isVerified,
  })
  verifyDate?: Date;

  @prop({
    required: isVerified,
  })
  password?: string;

  @prop({
    required: isVerified,
  })
  email?: string;

  @prop()
  set rawPassword(password: string) {
    const salt = bcrypt.genSaltSync(12);
    this.password = bcrypt.hashSync(password, salt);
  }

  @instanceMethod
  checkPassword(this: InstanceType<User>, password: string) {
    return bcrypt.compareSync(password, <string>this.password);
  }

  @staticMethod
  static generateTestJobName() {
    const values = 'abcdefghijklmnopqrstuvwxyz';
    const VALUES_NUMBER = values.length;
    const NAME_LENGTH = 18;

    let jobNameArray = [];

    for (let i = 0; i < NAME_LENGTH; i++) {
      jobNameArray[i] = values[random(0, VALUES_NUMBER - 1)];
    }

    return jobNameArray.join('');
  }
}

export const UserModel = new User().getModelForClass(User, {
  schemaOptions: {
    id: false,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toObject: {
      versionKey: false,
    },
  }
});
