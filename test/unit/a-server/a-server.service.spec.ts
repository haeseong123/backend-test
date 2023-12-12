import { Test, TestingModule } from '@nestjs/testing';
import { AServerApiPath } from 'src/a-server/enum/a-server-api-path';
import { AServerService } from 'src/a-server/a-server.service';
import { AServerRequestDto } from 'src/a-server/dto/a-server-request.dto';
import { CronService } from 'src/common/cron/cron.service';
import { RapidHttpService } from 'src/common/rapid-http/rapid-http.service';

describe('AServerService', () => {
  let aServerService: AServerService;
  let _cronService: CronService;
  let _rapidHttpService: RapidHttpService;

  beforeEach(async () => {
    const rapidHttpServiceMock = {
      sendRequest: jest.fn(),
    };
    const cronServiceMock = {
      addCronJob: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AServerService,
        { provide: CronService, useValue: cronServiceMock },
        { provide: RapidHttpService, useValue: rapidHttpServiceMock },
      ],
    }).compile();

    aServerService = module.get<AServerService>(AServerService);
    _cronService = module.get<CronService>(CronService);
    _rapidHttpService = module.get<RapidHttpService>(RapidHttpService);
  });

  describe('post', () => {
    it('성공', () => {
      // Given
      const dto = new AServerRequestDto(
        AServerApiPath.ROOT,
        '0000-0000-0000-0000',
      );
      const expectValue = true;

      // When
      const result = aServerService.post(dto);

      // Then
      expect(result).toBe(expectValue);
    });
  });

  describe('get', () => {
    it('성공', () => {
      // Given
      const dto = new AServerRequestDto(
        AServerApiPath.ROOT,
        '0000-0000-0000-0000',
      );
      const expectValue = true;

      // When
      const result = aServerService.get(dto);

      // Then
      expect(result).toBe(expectValue);
    });
  });

  describe('put', () => {
    it('성공', () => {
      // Given
      const dto = new AServerRequestDto(
        AServerApiPath.ROOT,
        '0000-0000-0000-0000',
      );
      const expectValue = true;

      // When
      const result = aServerService.put(dto);

      // Then
      expect(result).toBe(expectValue);
    });
  });

  describe('delete', () => {
    it('성공', () => {
      // Given
      const dto = new AServerRequestDto(
        AServerApiPath.ROOT,
        '0000-0000-0000-0000',
      );
      const expectValue = true;

      // When
      const result = aServerService.delete(dto);

      // Then
      expect(result).toBe(expectValue);
    });
  });
});
