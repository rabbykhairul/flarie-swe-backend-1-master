import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('coupon-redeem')
  redeemCoupon(@Req() request: Request): any {
    const body = request.body;
    return { status: 'OK', ...body };
  }
}
