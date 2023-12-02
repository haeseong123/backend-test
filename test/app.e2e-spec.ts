import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RapidResponse } from 'src/common/interceptor/rapid-response';
import { ErrorMessage } from 'src/common/exception/error-message';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('path: /', () => {
    it('[GET 성공]', async () => {
      const res = await request(app.getHttpServer())
        .get('/')
        .set('id', '0000-0000-0000-0000');

      const body: RapidResponse<boolean> = res.body;
      expect(body.statusCode).toBe(200);
      expect(body.result).toBe(true);
    });

    it('[GET 실패] - header에 id를 넣지 않음', async () => {
      const res = await request(app.getHttpServer()).get('/');

      const body: RapidResponse<null> = res.body;
      expect(body.statusCode).toBe(400);
      expect(body.message).toBe(ErrorMessage.CUSTOM_ID_HEADER_IS_MISSING);
      expect(body.result).toBe(null);
    });

    it('[GET 실패] - rate limiting 초과', async () => {
      const maxRequestSize = 10;
      const requests = Array.from({ length: maxRequestSize }, () =>
        request(app.getHttpServer()).get('/').set('id', '0000-0000-0000-0000'),
      );
      const responses = await Promise.all(requests);

      const errorRequest = request(app.getHttpServer())
        .get('/')
        .set('id', '0000-0000-0000-0000');
      const errorResponse = await errorRequest;

      responses.forEach((res) => {
        const body: RapidResponse<boolean> = res.body;
        expect(body.statusCode).toBe(200);
        expect(body.result).toBe(true);
      });

      const body: RapidResponse<null> = errorResponse.body;
      expect(body.statusCode).toBe(429);
      expect(body.result).toBe(null);
    });
  });
});
