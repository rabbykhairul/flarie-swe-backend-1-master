import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

interface CouponRedeemReqBody {
  playerId: number;
  couponId: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('coupon-redeem')
  redeemCoupon(@Body() body: CouponRedeemReqBody): any {
    return { status: 'OK', ...body };
  }
}
