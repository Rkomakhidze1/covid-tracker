import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './countries/countries.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CountriesModule, StatisticsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
