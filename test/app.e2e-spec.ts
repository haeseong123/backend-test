import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { RapidResponse } from 'src/common/interceptor/rapid-response';

/**
 * https://github.com/nestjs/schedule/issues/60
 *
 * @Cron 때문에 에러 발생 ...
 */
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/')
      .set('id', '0000-0000-0000-0000');

    const body: RapidResponse<boolean> = res.body;
    expect(body.statusCode).toBe(200);
    expect(body.result).toBe(true);
  });
});
