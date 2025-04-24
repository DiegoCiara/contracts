const { CronJob } = require('cron');

const job = new CronJob('*/3 * * * * *', () => {
  console.log('Executando a cada 3 segundos...');
});

job.start();