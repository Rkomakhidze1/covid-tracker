import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import axios from 'axios';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class SqliteSeedingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SqliteSeedingService.name);

  constructor(private countriesService: CountriesService) {}
  async onApplicationBootstrap() {
    if ((await this.countriesService.findAll()).length > 0) {
      this.logger.log('seeding skipped');
      return;
    }

    try {
      const resp = await axios.get('https://devtest.ge/countries');
      for (const country of resp.data) {
        await this.countriesService.create(country);
      }
    } catch (e) {
      console.error('something went wrong during seeding', e);
      process.exit();
    }
    this.logger.log('seeding done');
  }
}
