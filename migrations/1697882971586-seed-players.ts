import { connectionSource } from '../src/typeorm';
import { MigrationInterface, QueryRunner } from 'typeorm';

const players = [
  {
    name: 'Khairul',
  },
  {
    name: 'Rakib',
  },
  {
    name: 'Mosabbir',
  },
];
export class SeedPlayers1697882971586 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repository = connectionSource.getRepository('Player');
    for (let player of players) {
      await repository.save(player);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
