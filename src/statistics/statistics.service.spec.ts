import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Statistic } from './entities/statistic.entity';
import { StatisticsService } from './statistics.service';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let statisticsRepo: Repository<Statistic>;

  beforeEach(async () => {
    const fakeStatisticsRepo = {
      create: jest.fn((arg) => Promise.resolve(arg)),
      save: jest.fn((arg) => Promise.resolve(arg)),
      findOne: jest.fn((arg) => Promise.resolve(arg)),
      find: jest.fn((arg) => Promise.resolve(arg)),
      findOneBy: jest.fn((arg) => Promise.resolve(arg)),
      remove: jest.fn((arg) => Promise.resolve(arg)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(Statistic),
          useValue: fakeStatisticsRepo,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    statisticsRepo = module.get<Repository<Statistic>>(
      getRepositoryToken(Statistic),
    );
  });

  it('statistics service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('statistics repo should be defined', () => {
    expect(statisticsRepo).toBeDefined();
  });

  describe('create', () => {
    it('should save statistic in db', async () => {
      const createDto: CreateStatisticDto = {
        death: 1,
        recovered: 1,
        confirmed: 1,
      };

      await expect(service.create(createDto)).resolves.toEqual(createDto);
    });

    it('should return null if contryId is not provided', async () => {
      expect(service.findByCountryId(undefined)).toEqual(null);
    });
  });

  describe('findAll', () => {
    it('should retrieve every statistic from db', async () => {
      const findAllResponse = [
        'statisticOne',
        'statisticTwo',
      ] as unknown as Statistic[];
      const mockFind = jest.fn(() => Promise.resolve(findAllResponse));
      statisticsRepo.find = mockFind;

      await expect(service.findAll()).resolves.toEqual(findAllResponse);
    });
  });

  describe('findOne', () => {
    it('should retrieve single statistic from db', async () => {
      const findOneResponse = { id: 1 } as unknown as Statistic;
      const mockFind = jest.fn(() => Promise.resolve(findOneResponse));
      statisticsRepo.findOneBy = mockFind;

      await expect(service.findOne(1)).resolves.toEqual(findOneResponse);
    });

    it('should return null if id is not provided', async () => {
      expect(service.findOne(undefined)).toEqual(null);
    });
  });

  describe('findByCountryId', () => {
    it('should retrieve single statistic from db by countryId', async () => {
      const findOneByCountryIdResponse = { id: 1 } as unknown as Statistic;
      const mockFindByCountryId = jest.fn(() =>
        Promise.resolve(findOneByCountryIdResponse),
      );
      statisticsRepo.findOne = mockFindByCountryId;

      await expect(service.findByCountryId(1)).resolves.toEqual(
        findOneByCountryIdResponse,
      );
    });

    it('should return null if contryId is not provided', async () => {
      expect(service.findByCountryId(undefined)).toEqual(null);
    });
  });

  describe('update', () => {
    it('should update statistic in db', async () => {
      const updateDto: UpdateStatisticDto = { death: 2, recovered: 1 };
      const mockFindOne = jest.fn(() =>
        Promise.resolve({} as unknown as Statistic),
      );
      statisticsRepo.findOneBy = mockFindOne;

      await expect(service.update(1, updateDto)).resolves.toEqual(updateDto);
    });

    it('should throw not found error if statistic does not exist', async () => {
      const mockFindOne = jest.fn(() => Promise.resolve(null));
      statisticsRepo.findOneBy = mockFindOne;
      expect(() => service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove statistic from db', async () => {
      const removeResponse = { id: 1 } as Statistic;
      const mockFindOne = jest.fn(() => Promise.resolve(removeResponse));
      statisticsRepo.findOneBy = mockFindOne;

      await expect(service.remove(1)).resolves.toEqual(removeResponse);
    });

    it('should throw not found error if statistic does not exist', async () => {
      const mockFindOne = jest.fn(() => Promise.resolve(null));
      statisticsRepo.findOneBy = mockFindOne;
      expect(() => service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
