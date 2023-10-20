import {
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

    return { status: 'OK', player, coupon };
  }
}
