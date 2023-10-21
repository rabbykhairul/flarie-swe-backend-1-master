import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { CouponRedeemDto } from '../dto/couponRedeem.dto';
import { validationExceptionFactory } from '../shared/exceptions/validation.exception';
import { CouponService } from './coupon.service';
import { PlayerService } from '../player/player.service';
import { errorCodes } from '../shared/errorCodes';

@Controller()
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly playerService: PlayerService,
  ) {}

  @Post('coupon-redeem')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  )
  async redeemCoupon(
    @Body() body: CouponRedeemDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { playerId, rewardId } = body;

    const player = await this.playerService.findById(playerId);
    const coupon = await this.couponService.findByIdWithReward(rewardId);

    if (!player)
      throw new BadRequestException({
        errorCode: errorCodes.PLAYER_NOT_FOUND.code,
        error: errorCodes.PLAYER_NOT_FOUND.description,
      });

    if (!coupon)
      throw new BadRequestException({
        errorCode: errorCodes.COUPON_NOT_FOUND.code,
        error: errorCodes.COUPON_NOT_FOUND.description,
      });

    const expired = this.couponService.isExpiredReward(coupon.Reward);
    if (expired)
      throw new BadRequestException({
        errorCode: errorCodes.REWARD_EXPIRED.code,
        error: errorCodes.REWARD_EXPIRED.description,
      });

    const redeemedBefore = await this.couponService.couponAlreadyRedeemed(
      rewardId,
      playerId,
    );
    if (redeemedBefore)
      throw new BadRequestException({
        errorCode: errorCodes.COUPON_ALREADY_USED.code,
        error: errorCodes.COUPON_ALREADY_USED.description,
      });

    const dailyUsageLimitReached =
      await this.couponService.dailyUsageLimitReached(playerId, coupon.Reward);
    if (dailyUsageLimitReached)
      throw new BadRequestException({
        errorCode: errorCodes.DAILY_LIMIT_REACHED.code,
        error: errorCodes.DAILY_LIMIT_REACHED.description,
      });

    const totalUsageLimitReached =
      await this.couponService.totalUsageLimitReached(playerId, coupon.Reward);
    if (totalUsageLimitReached)
      throw new BadRequestException({
        errorCode: errorCodes.TOTAL_LIMIT_REACHED.code,
        error: errorCodes.TOTAL_LIMIT_REACHED.description,
      });

    await this.couponService.redeemCoupon(coupon, player);
    return { id: coupon.id, value: coupon.value };
  }
}
