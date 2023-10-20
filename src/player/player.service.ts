import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/Player';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player) private readonly player: Repository<Player>,
  ) {}

  findById(id: number): Promise<Player | null> {
    return this.player.findOneBy({ id });
  }
}
