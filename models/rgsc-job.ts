import {Typegoose, prop, index} from 'typegoose';

export enum RgscJobStatus {
  NotProcessed = 'notProcessed',
  NeedUpdateStats = 'needUpdStats',
  Processed = 'processed',
}

@index({
  jobId: 1,
  jobCurrId: 1,
}, {
  unique: true,
})
class RgscJob extends Typegoose {
  @prop({
    required: true,
  })
  jobId!: string;

  @prop({
    required: true,
  })
  jobCurrId!: string;

  @prop({
    required: true,
  })
  job!: object;

  @prop()
  jobExtInfo?: object;

  @prop({
    required: true,
  })
  ver!: number;

  @prop({
    required: true,
  })
  fetchFirst!: Date;

  @prop({
    required: true,
  })
  fetchLast!: Date;

  @prop({
    enum: RgscJobStatus,
    required: true,
  })
  status!: RgscJobStatus;

  @prop({
    required(this: RgscJob) {
      return this.status === RgscJobStatus.Processed;
    },
  })
  processDate?: Date;
}

export const RgscJobModel = new RgscJob().getModelForClass(RgscJob, {
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
