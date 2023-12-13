import { Test, TestingModule } from '@nestjs/testing';
import { AServerController } from 'src/a-server/a-server.controller';
import { AServerService } from 'src/a-server/a-server.service';

describe('AServerController', () => {
  let aServerController: AServerController;
  let aServerService: AServerService;

  beforeEach(async () => {
    const aServerServiceMock = {
      get: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AServerController],
      providers: [{ provide: AServerService, useValue: aServerServiceMock }],
    }).compile();

    aServerController = module.get<AServerController>(AServerController);
    aServerService = module.get<AServerService>(AServerService);
  });

  describe('/ 호출', () => {
    it('성공', async () => {
      // Given
      const id = '0000-0000-0000-0000';
      const expectValue = true;

      jest.spyOn(aServerService, 'get').mockResolvedValue(expectValue);

      // When
      const result = await aServerController.get(id);

      // Then
      expect(result).toBe(expectValue);
    });
  });
});
