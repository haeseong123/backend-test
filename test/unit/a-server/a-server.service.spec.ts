import { Test, TestingModule } from '@nestjs/testing';
import { AServerApiPath } from 'src/a-server/enum/a-server-api-path';
import { AServerService } from 'src/a-server/a-server.service';
import { AServerRequestDto } from 'src/a-server/dto/a-server-request.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LinkedQueue } from 'src/common/structure/que/linked/linked-queue';

describe('AServerService', () => {
  let aServerService: AServerService;

  beforeEach(async () => {
    const cacheManagerMock = {
      get: async () => new LinkedQueue(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AServerService,
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    }).compile();

    aServerService = module.get<AServerService>(AServerService);
  });

  describe('post', () => {
    it('성공', async () => {
      // Given
      const dto = new AServerRequestDto(
        AServerApiPath.ROOT,
        '0000-0000-0000-0000',
      );
      const expectValue = true;

      // When
      const result = await aServerService.post(dto);

      // Then
      expect(result).toBe(expectValue);
    });
  });

  describe('get', () => {
    it('성공', async () => {
      // Given
      const dto = new AServerRequestDto(
        AServerApiPath.ROOT,
        '0000-0000-0000-0000',
      );
      const expectValue = true;

      // When
      const result = await aServerService.get(dto);

      // Then
      expect(result).toBe(expectValue);
    });
  });

  describe('put', () => {
    it('성공', async () => {
      // Given
      const dto = new AServerRequestDto(
        AServerApiPath.ROOT,
        '0000-0000-0000-0000',
      );
      const expectValue = true;

      // When
      const result = await aServerService.put(dto);

      // Then
      expect(result).toBe(expectValue);
    });
  });

  describe('delete', () => {
    it('성공', async () => {
      // Given
      const dto = new AServerRequestDto(
        AServerApiPath.ROOT,
        '0000-0000-0000-0000',
      );
      const expectValue = true;

      // When
      const result = await aServerService.delete(dto);

      // Then
      expect(result).toBe(expectValue);
    });
  });
});
