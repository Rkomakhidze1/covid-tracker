import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import axios from 'axios';
import { CountriesService } from 'src/countries/countries.service';

@Injectable()
export class SqliteSeedingService implements OnApplicationBootstrap {
  constructor(private countriesService: CountriesService) {}
  async onApplicationBootstrap() {
    if ((await this.countriesService.findAll()).length > 0) {
      console.log('seeding skipped');
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
    console.log('seeding done');
  }
}
