import { addDays, format, subDays } from 'date-fns';
import { connectionSource } from '../../src/typeorm';

const seedRewards = async () => {
  const startDate = new Date();
  const endDate = addDays(startDate, 7);

  await connectionSource.createQueryRunner().query(`
  INSERT INTO reward (name, startDate, endDate, perDayLimit, totalLimit)
  VALUES
    ('DiGiCell Eid Rewards', '${format(
      startDate,
      'y-M-d HH:mm:ss',
    )}', '${format(endDate, 'y-M-d HH:mm:ss')}', '3', '21'),
    ('Summer discount (expired)', '${format(
      subDays(startDate, 1),
      'y-M-d HH:mm:ss',
    )}', '${format(subDays(startDate, 8), 'y-M-d HH:mm:ss')}', '3', '21'),
    ('Atumn rewards (daily limit reached)', '${format(
      startDate,
      'y-M-d HH:mm:ss',
    )}', '${format(endDate, 'y-M-d HH:mm:ss')}', '0', '21'),
    ('Fall rewards (total limit reached)', '${format(
      startDate,
      'y-M-d HH:mm:ss',
    )}', '${format(endDate, 'y-M-d HH:mm:ss')}', '3', '1')
  `);
};

const seedDb = async () => {
  await connectionSource.dropDatabase();
  await connectionSource.synchronize();

  await seedRewards();
};

export const seedTestDb = async () => {
  try {
    console.log('Seeding DB....');
    await seedDb();
    console.log('Done!');
  } catch (err) {
    console.log(err);
  }
};
