import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { connectionSource } from '../src/typeorm';
import { DataSource } from 'typeorm';
import { errorCodes } from '../src/shared/errorCodes';
import { seedTestDb } from '../seed/test/seeder';

describe('Coupon redeem endpoint (e2e)', () => {
  let app: INestApplication;
  let dbConnection: DataSource;
  let server: request.SuperTest<request.Test>;

  const COUPON_REDEEM_ENPOINT = '/coupon-redeem';

  beforeAll(async () => {
    dbConnection = await connectionSource.initialize();
    await seedTestDb();

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
      .send({ playerId: 4, rewardId: 1 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.PLAYER_NOT_FOUND.code,
    });
  });

  it("Should fail if the reward coupon doesn't exist", async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 1, rewardId: 13 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.COUPON_NOT_FOUND.code,
    });
  });

  it('Should fail if the reward campaign has expired', async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 1, rewardId: 9 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.REWARD_EXPIRED.code,
    });
  });

  it('Should redeem coupon successfully', async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 1, rewardId: 1 })
      .expect(201);

    expect(body).toMatchObject({
      id: expect.any(Number),
      value: expect.any(String),
    });
  });

  it('Should fail to redeem already used reward coupon', async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 1, rewardId: 1 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.COUPON_ALREADY_USED.code,
    });
  });

  it('Should fail if the user has reached his daily redeem usage limit', async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 1, rewardId: 10 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.DAILY_LIMIT_REACHED.code,
    });
  });

  it('Should fail if the user has reached his total redeem usage limit', async () => {
    const { body } = await server
      .post(COUPON_REDEEM_ENPOINT)
      .send({ playerId: 1, rewardId: 12 })
      .expect(400);

    expect(body).toMatchObject({
      errorCode: errorCodes.TOTAL_LIMIT_REACHED.code,
    });
  });

  afterAll(async () => {
    // await dbConnection.dropDatabase();
    await dbConnection.destroy();
    await app.close();
  });
});
