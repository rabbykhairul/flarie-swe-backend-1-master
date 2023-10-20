import { IsNumber } from 'class-validator';

export class RedeemCouponDTO {
  @IsNumber()
  playerId: number;

  @IsNumber()
  rewardId: number;
}
