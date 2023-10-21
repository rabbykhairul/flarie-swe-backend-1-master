import { connectionSource } from '../src/typeorm';
import { MigrationInterface, QueryRunner } from 'typeorm';

export const seedPlayers = [
  {
    id: 1,
    name: 'Khairul',
  },
  {
    id: 2,
    name: 'Rakib',
  },
  {
    id: 3,
    name: 'Mosabbir',
  },
];
export class SeedPlayers1697882971586 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repository = connectionSource.getRepository('Player');
    for (let player of seedPlayers) {
      await repository.save(player);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
