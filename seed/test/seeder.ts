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
    )}', '${format(endDate, 'y-M-d HH:mm:ss')}', '3', '0')
  `);
};

const seedCoupons = async () => {
  await connectionSource.createQueryRunner().query(`
  INSERT INTO coupon (value, rewardId)
  VALUES
    ('Air ticket', '1'),
    ('Nike shoes', '1'),
    ('Apple watch SE', '1'),
    ('iPhone 13 pro', '1'),
    ('T-shirt', '1'),
    ('Fossil watch', '1'),
    ('Joggers', '1'),
    ('Running shoes', '1'),
    ('Fossil watch', '2'),
    ('30% discount', '3'),
    ('Water bottle', '4'),
    ('Air ticket', '4')
  `);
};

const seedPlayers = async () => {
  await connectionSource.createQueryRunner().query(`
  INSERT INTO player (name)
  VALUE
    ('Khairul'),
    ('Rakib'),
    ('Mosabbir')
  `);
};

const seedDb = async () => {
  await connectionSource.dropDatabase();
  await connectionSource.synchronize();

  await seedRewards();
  await seedCoupons();
  await seedPlayers();
};

export const seedTestDb = async () => {
  try {
    await seedDb();
  } catch (err) {
    console.log(err);
  }
};
