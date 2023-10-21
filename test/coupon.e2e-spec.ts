import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { connectionSource } from '../src/typeorm';
import { DataSource } from 'typeorm';

describe('Coupon redeem endpoint (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;
  let server: request.SuperTest<request.Test>;

  const COUPON_REDEEM_ENPOINT = '/coupon-redeem';

  beforeAll(async function setUpDbConnection() {
    connection = await connectionSource.initialize();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = request(app.getHttpServer());
  });

  afterAll(async () => {
    const entities = connectionSource.entityMetadatas;

    for (let entity of entities) {
      if (entity.name === 'PlayerCoupon') {
        const repo = connection.getRepository(entity.name);
        await repo.clear();
      }
    }
    await app.close();
    await connection.destroy();
  });
});
