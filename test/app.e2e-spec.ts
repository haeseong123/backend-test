import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

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

      expect(res.status).toBe(200);
    });

    it('[GET 실패] - header에 id를 넣지 않음', async () => {
      const res = await request(app.getHttpServer()).get('/');

      expect(res.status).toBe(500);
    });

    it('[GET 실패] - rate limiting 초과', async () => {
      const maxRequestSize = 10;
      const requests = Array.from({ length: maxRequestSize + 1 }, () =>
        request(app.getHttpServer()).get('/').set('id', '0000-0000-0000-0000'),
      );
      const responses = await Promise.all(requests);

      responses
        .slice(0, maxRequestSize)
        .forEach((res) => expect(res.status).toBe(200));
      expect(responses[maxRequestSize].status).toBe(429);
    });
  });
});
