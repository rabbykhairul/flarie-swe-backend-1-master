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
import { CouponRedeemDto } from 'src/dto/couponRedeem.dto';
import { validationExceptionFactory } from 'src/shared/exceptions/validation.exception';
import { CouponService } from './coupon.service';
import { PlayerService } from 'src/player/player.service';
import { errorCodes } from 'src/shared/errorCodes';

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
        errorCode: errorCodes.REWARD_EXPIRED,
        error: errorCodes.REWARD_EXPIRED.description,
      });

    return { expired, player, coupon };
  }
}
