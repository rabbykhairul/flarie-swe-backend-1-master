import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import typeorm from './typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Player } from './entities/Player';
import { Reward } from './entities/Reward';
import { CouponController } from './coupon/coupon.controller';
import { CouponService } from './coupon/coupon.service';
import { Coupon } from './entities/Coupon';
import { PlayerCoupon } from './entities/PlayerCoupon';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    TypeOrmModule.forFeature([Player, Reward, Coupon, PlayerCoupon]),
  ],
  controllers: [AppController, CouponController],
  providers: [AppService, CouponService],
})
export class AppModule {}
