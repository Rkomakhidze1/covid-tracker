import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './countries/countries.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { Statistic } from './statistics/entities/statistic.entity';
import { Country } from './countries/entities/country.entity';
import { SqliteSeedingService } from './seeds/SqliteSeedingService.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Country, Statistic],
      synchronize: true,
    }),
    CountriesModule,
    StatisticsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, SqliteSeedingService],
})
export class AppModule {}
