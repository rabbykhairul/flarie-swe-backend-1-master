import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { startOfDay, endOfDay } from 'date-fns';
import { Coupon } from 'src/entities/Coupon';
import { Player } from 'src/entities/Player';
import { PlayerCoupon } from 'src/entities/PlayerCoupon';
import { Reward } from 'src/entities/Reward';
import { Between, Repository } from 'typeorm';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Player) private readonly player: Repository<Player>,
    @InjectRepository(Coupon) private readonly coupon: Repository<Coupon>,
    @InjectRepository(Reward) private readonly reward: Repository<Reward>,
    @InjectRepository(PlayerCoupon)
    private readonly playerCoupon: Repository<PlayerCoupon>,
  ) {}

  findByIdWithReward(id: number): Promise<Coupon | null> {
    return this.coupon.findOne({
      where: { id },
      relations: {
        Reward: true,
      },
    });
  }

  isExpiredReward(reward: Reward) {
    const today = new Date();
    const startDate = new Date(reward.startDate);
    const endDate = new Date(reward.endDate);

    return !(startDate <= today && endDate >= today);
  }

  async couponAlreadyRedeemed(id: number, playerId: number): Promise<boolean> {
    const redeemedCoupon = await this.playerCoupon.findOneBy({
      coupon: {
        id,
      },
      player: {
        id: playerId,
      },
    });

    if (redeemedCoupon) return true;

    return false;
  }

  async dailyUsageLimitReached(
    playerId: number,
    reward: Reward,
  ): Promise<boolean> {
    const today = new Date();

    const count = await this.playerCoupon.countBy({
      player: {
        id: playerId,
      },
      coupon: {
        Reward: {
          id: reward.id,
        },
      },
      redeemedAt: Between(startOfDay(today), endOfDay(today)),
    });

    return count >= reward.perDayLimit;
  }

  async totalUsageLimitReached(
    playerId: number,
    reward: Reward,
  ): Promise<boolean> {
    const startDate = new Date(reward.startDate);
    const endDate = new Date(reward.endDate);
    

    const count = await this.playerCoupon.countBy({
      player: {
        id: playerId,
      },
      coupon: {
        Reward: {
          id: reward.id,
        },
      },
      redeemedAt: Between(startOfDay(startDate), endOfDay(endDate)),
    });

    return count >= reward.totalLimit;
  }
}
