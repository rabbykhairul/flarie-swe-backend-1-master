import { connectionSource } from '../src/typeorm';
import { MigrationInterface, QueryRunner } from 'typeorm';

const coupons = [
  {
    value: 'Airline Ticket',
    Reward: {
      id: 1,
    },
  },
  {
    value: 'Nike shoes',
    Reward: {
      id: 1,
    },
  },
  {
    value: 'Apple watch SE',
    Reward: {
      id: 1,
    },
  },
  {
    value: 'iPhone 13 pro',
    Reward: {
      id: 1,
    },
  },
  {
    value: 'Fossil watch',
    Reward: {
      id: 1,
    },
  },
  {
    value: 'T-shirt',
    Reward: {
      id: 1,
    },
  },
  {
    value: 'Apple watch SE',
    Reward: {
      id: 2,
    },
  },
];

export class SeedCoupons1697882391716 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repository = connectionSource.getRepository('Coupon');
    for (let coupon of coupons) {
      await repository.save(coupon);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
