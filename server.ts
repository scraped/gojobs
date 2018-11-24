import chalk from 'chalk';
import app from './app';
import {bootstrap} from './lib/bootstrap';

bootstrap().then(() => {
  const port: string = app.get('port');

  app.listen(port, () => {
    console.log(chalk.blue(`Server is running on http://localhost:${port}`));
  });
});

process.on('unhandledRejection', err => {
  console.error('Unhandled rejection occured:', err);
  process.exit(1);
});
