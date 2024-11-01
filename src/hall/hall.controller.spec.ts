import { Test, TestingModule } from '@nestjs/testing';
import { HallController } from './hall.controller';
import { HallService } from './hall.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';

describe('HallController', () => {
  let controller: HallController;
  let service: HallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HallController],
      providers: [
        {
          provide: HallService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<HallController>(HallController);
    service = module.get<HallService>(HallService);
  });

  describe('공연장 테스트', () => {
    it('공연장 만들기 성공 검증', async () => {
      const createHallDto: CreateHallDto = {
        hallName: '고척돔',
        location: '서울',
        totalSeat: 100,
      };

      (service.create as jest.Mock).mockResolvedValue(createHallDto);

      const result = await controller.createHall(createHallDto);

      expect(result).toEqual(createHallDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createHallDto);
    });

    it('공연장 수정 성공 검증', async () => {
      const id: number = 1;
      const updateHallDto: UpdateHallDto = {
        hallName: '고척돔2',
      };

      (service.update as jest.Mock).mockResolvedValue(updateHallDto);

      const result = await controller.updateHall(id, updateHallDto);

      expect(result).toEqual(updateHallDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, updateHallDto);
    });

    it('공연장 삭제 성공 검증', async () => {
      const id = 1;

      (service.delete as jest.Mock).mockResolvedValue({ deleted: true });

      const result = await controller.deleteHall(id);

      expect(result).toEqual({ deleted: true });
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(id);
    });

    it('공연장 목록 조회 검증', async () => {
      const halls = [
        { hallName: '고척돔', location: '서울', totalSeat: 100 },
        { hallName: '잠실실내체육관', location: '서울', totalSeat: 80 },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(halls);

      const result = await controller.findAll();

      expect(result).toEqual(halls);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
