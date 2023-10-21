import { addDays, subDays } from 'date-fns';
import { connectionSource } from '../src/typeorm';
import { MigrationInterface, QueryRunner } from 'typeorm';

const startDate = new Date();
const endDate = addDays(startDate, 7);

export const seedRewardCampigns = [
  {
    id: 1,
    name: 'DiGiCell Eid Rewards',
    startDate,
    endDate,
    perDayLimit: 3,
    totalLimit: 21,
  },
  {
    id: 2,
    name: 'Summer dicsounts (expired)',
    startDate: subDays(startDate, 8),
    endDate: subDays(startDate, 1),
    perDayLimit: 3,
    totalLimit: 21,
  },
];

export class SeedRewards1697881836519 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repository = connectionSource.getRepository('Reward');
    for (let reward of seedRewardCampigns) {
      await repository.save(reward);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
