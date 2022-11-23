import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Statistic } from './entities/statistic.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private readonly statisticRepo: Repository<Statistic>,
  ) {}

  create(createStatisticDto: CreateStatisticDto) {
    const statistic = this.statisticRepo.create(createStatisticDto);
    return this.statisticRepo.save(statistic);
  }

  findAll() {
    // statistic
    // can be paginated
    return this.statisticRepo.find();
  }

  findOne(id: number) {
    if (!id) return null;

    return this.statisticRepo.findOneBy({ id });
  }

  async update(id: number, updateStatisticDto: UpdateStatisticDto) {
    const statistic = await this.findOne(id);
    if (!statistic) {
      throw new NotFoundException('statistic not found');
    }
    Object.assign(statistic, updateStatisticDto);
    return this.statisticRepo.save(statistic);
  }

  async remove(id: number) {
    const statistic = await this.findOne(id);
    if (!statistic) {
      throw new NotFoundException('statistic not found');
    }
    return this.statisticRepo.remove(statistic);
  }
}
