import mongoose from 'mongoose';
import config from '.';

export async function connect(): Promise<void> {
  mongoose.Promise = global.Promise;

  const {
    uri: connectUri,
    options: connectOptions,
  } = config.mongo;

  await mongoose.connect(connectUri, connectOptions);

  console.log('Connection to the mongodb established');

  mongoose.set('useCreateIndex', true);
}


