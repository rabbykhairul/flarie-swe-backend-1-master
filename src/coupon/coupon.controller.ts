import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from 'src/app.service';
import { CouponRedeemDto } from 'src/dto/couponRedeem.dto';
import { validationExceptionFactory } from 'src/shared/exceptions/validation.exception';

@Controller()
export class CouponController {
  constructor(private readonly appService: AppService) {}

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
    console.log('body: ', body);
    const players = await this.appService.getAllPlayers();
    return { status: 'OK', ...body, players };
  }
}
