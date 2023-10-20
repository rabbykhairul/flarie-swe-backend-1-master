import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { validationExceptionFactory } from './shared/exceptions/validation.exception';
import { RedeemCouponDTO } from './dto/redeem-coupon.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('coupon-redeem')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  )
  redeemCoupon(
    @Body() body: RedeemCouponDTO,
    @Res({ passthrough: true }) res: Response,
  ): any {
    console.log('body: ', body);
    return { status: 'OK', ...body };
  }
}
