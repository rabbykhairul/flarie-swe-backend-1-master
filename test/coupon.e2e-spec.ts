import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { connectionSource } from '../src/typeorm';
import { DataSource } from 'typeorm';
import { errorCodes } from '../src/shared/errorCodes';

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

  it("Should fail if the paylod doesn't include 'playerId' field", async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ couponId: 1 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.VALIDATION_ERROR.code,
      errors: expect.objectContaining({
        playerId: expect.any(Array),
      }),
    });
  });

  it("Should fail if the paylod doesn't include 'rewardId' field", async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 1 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.VALIDATION_ERROR.code,
      errors: expect.objectContaining({
        rewardId: expect.any(Array),
      }),
    });
  });

  it("Should fail if the paylod doesn't include 'rewardId' & 'playerId' field", async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 1 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.VALIDATION_ERROR.code,
      errors: expect.any(Object),
    });
  });

  it("Should fail if the player doesn't exist", async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 3, rewardId: 1 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.PLAYER_NOT_FOUND.code,
    });
  });

  it("Should fail if the reward coupon doesn't exist", async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 1, rewardId: 10 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.COUPON_NOT_FOUND.code,
    });
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
