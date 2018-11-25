import {Typegoose, prop} from 'typegoose';

function nonRockstar(this: Crew) {
  return !this.rockstar;
}

class Crew extends Typegoose {
  @prop({
    unique: true,
    required: true,
  })
  crewId!: number;

  @prop({
    unique: true,
    required: true,
  })
  slug!: string;

  @prop()
  rockstar?: boolean;

  @prop({
    required: nonRockstar,
  })
  leader?: string;

  @prop({
    required: true,
  })
  name!: string;

  @prop({
    maxlength: 64,
  })
  motto?: string;

  @prop({
    minlength: 3,
    maxlength: 4,
    required: true,
  })
  tag!: string;

  @prop({
    minlength: 6,
    maxlength: 6,
    required: nonRockstar,
  })
  color?: string;

  @prop({
    min: 0,
    validate: Number.isInteger,
    required: true,
  })
  memberCount!: number;

  @prop({
    minlength: 4,
    maxlength: 4,
    required: true,
  })
  avatarId!: string;

  @prop({
    required: true,
  })
  fetchLast!: Date;

  @prop({
    required: true,
  })
  fetchNext!: Date;
}

export const CrewModel = new Crew().getModelForClass(Crew, {
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
