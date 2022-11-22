import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Statistic } from './entities/statistic.entity';
import { AuthModule } from './../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Statistic]), AuthModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
