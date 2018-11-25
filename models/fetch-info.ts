import {Typegoose, prop, index} from 'typegoose';
import {Platforms} from '../config/static/platforms';

export enum ByTypes {
  Rockstar = 'rockstar',
  Crew = 'crew',
  User = 'user',
}

export enum RockstarIds {
  Rockstar = 'rockstar',
  RockstarVerified = 'verified',
}

@index({
  by: 1,
  id: 1,
  plat: 1,
}, {
  unique: true,
})
class FetchInfo extends Typegoose {
  @prop({
    enum: ByTypes,
    required: true,
  })
  by!: ByTypes;

  @prop({
    validate(this: FetchInfo, value: string) {
      return !(this.by === ByTypes.Rockstar && !RockstarIds[<any>value]);
    },
    required: true,
  })
  id!: string;

  @prop({
    enum: Platforms,
    required(this: FetchInfo) {
      return this.by !== ByTypes.Rockstar;
    }
  })
  plat?: Platforms;

  @prop({
    required: true,
  })
  fetchAllowed!: boolean;

  @prop({
    min: 0,
    validate: Number.isInteger,
    required: true,
  })
  fetches!: number;

  @prop({
    min: 0,
    validate: Number.isInteger,
    required: true,
  })
  jobs!: number;

  @prop({
    min: 0,
    validate: Number.isInteger,
    required(this: FetchInfo) {
      return !this.fetchOnlyNew;
    }
  })
  offset?: number;

  @prop({
    required(this: FetchInfo) {
      return this.fetches;
    }
  })
  fetchFirst?: Date;

  @prop({
    required(this: FetchInfo) {
      return this.fetchFirst;
    }
  })
  fetchLast?: Date;

  @prop({
    required: true,
  })
  fetchNext!: Date;

  @prop()
  fetchOnlyNew?: boolean;

  @prop({
    default: new Date(0),
    required: true,
  })
  maxUpdateDate!: Date;

  @prop({
    default: new Date(0),
    required: true,
  })
  prevMaxUpdateDate!: Date;
}

export const FetchInfoModel = new FetchInfo().getModelForClass(FetchInfo, {
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
