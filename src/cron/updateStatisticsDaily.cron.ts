import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { CountriesService } from 'src/countries/countries.service';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly countriesService: CountriesService,
  ) {
    console.log('task scheduled');
  }

  @Cron('45 * * * * *')
  async updateStatistic() {
    const countries = await this.countriesService.findAll();
    for (const country of countries) {
      const { code } = country;
      const {
        confirmed = 0,
        recovered = 0,
        deaths: death = 0,
      } = (
        await axios.post('https://devtest.ge/get-country-statistics', { code })
      ).data;
      console.log(confirmed, recovered, death, country.id);
      await this.statisticsService.create({
        confirmed,
        recovered,
        death,
        country,
      });
    }
    console.log('updated statistics table');
  }
}
