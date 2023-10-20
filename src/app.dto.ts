import { IsNumber } from 'class-validator';

export class RedeemCouponDTO {
  @IsNumber({}, { groups: ['playerId'] })
  playerId: number;

  @IsNumber()
  rewardId: number;
}
