import {Schema, Document, Model, model} from 'mongoose';

export interface IJobCollectionModel extends Document {
  name: string;
  id?: string;
  desc?: string;
  system?: boolean;
  author?: string;
  jobs: Array<string>;
  createDate: Date;
  updateDate: Date;
}

const schema: Schema = new Schema({
  name: {type: String, required: true},
  desc: {type: String},
  author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  jobs: {type: [Schema.Types.ObjectId], required: true, ref: 'Job'},
}, {
  id: false,
  toObject: {
    versionKey: false,
  },
});

export const JobCollection: Model<IJobCollectionModel> = model<IJobCollectionModel>('JobCollection', schema);
