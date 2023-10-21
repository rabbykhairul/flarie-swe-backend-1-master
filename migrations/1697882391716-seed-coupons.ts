import { connectionSource } from '../src/typeorm';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { seedRewardCampigns } from './1697881836519-seed-rewards';

export const seedCoupons = [
  {
    id: 1,
    value: 'Airline Ticket',
    Reward: seedRewardCampigns[0],
  },
  {
    id: 2,
    value: 'Nike shoes',
    Reward: seedRewardCampigns[0],
  },
  {
    id: 3,
    value: 'Apple watch SE',
    Reward: seedRewardCampigns[0],
  },
  {
    id: 4,
    value: 'iPhone 13 pro',
    Reward: seedRewardCampigns[0],
  },
  {
    id: 5,
    value: 'Fossil watch',
    Reward: seedRewardCampigns[0],
  },
  {
    id: 6,
    value: 'T-shirt',
    Reward: seedRewardCampigns[0],
  },
  {
    id: 7,
    value: 'Apple watch SE',
    Reward: seedRewardCampigns[0],
  },
];

export class SeedCoupons1697882391716 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repository = connectionSource.getRepository('Coupon');
    for (let coupon of seedCoupons) {
      await repository.save(coupon);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
