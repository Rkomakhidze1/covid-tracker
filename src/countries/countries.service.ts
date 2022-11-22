import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
  ) {}

  create(createCountryDto: CreateCountryDto) {
    const country = this.countryRepo.create(createCountryDto);
    return this.countryRepo.save(country);
  }

  findAll() {
    // can be paginated
    return this.countryRepo.find();
  }

  findOne(id: number) {
    if (!id) return null;

    return this.countryRepo.findOneBy({ id });
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.findOne(id);
    if (!country) {
      throw new NotFoundException('country not found');
    }
    Object.assign(country, updateCountryDto);
    return this.countryRepo.save(country);
  }

  async remove(id: number) {
    const country = await this.findOne(id);
    if (!country) {
      throw new NotFoundException('country not found');
    }
    return this.countryRepo.remove(country);
  }
}
