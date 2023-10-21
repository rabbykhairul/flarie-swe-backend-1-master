import { MigrationInterface, QueryRunner } from 'typeorm';
import { connectionSource } from '../src/typeorm';
import { seedPlayers } from './1697882971586-seed-players';
import { seedCoupons } from './1697882391716-seed-coupons';
import { format, formatISO } from 'date-fns';

const playerCoupons = [
  {
    Player: seedPlayers[0],
    Coupon: seedCoupons[0],
    redeemedAt: format(new Date(), 'y-M-d HH:mm:ss'),
  },
];

export class SeedPlayerCoupons1697883149885 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repository = connectionSource.getRepository('PlayerCoupon');
    await queryRunner.query(`
          INSERT INTO player_coupon (redeemedAt, playerId, couponId)
          VALUES
          ${playerCoupons.map(
            ({ redeemedAt, Player, Coupon }) =>
              `('${redeemedAt}', '${Player.id}', '${Coupon.id}')`,
          )}
          `);
    //   const data = repository.create();
    //   for (let k in coupon) {
    //     data[k] = coupon[k];
    //   }
    //   await repository.save(data);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
