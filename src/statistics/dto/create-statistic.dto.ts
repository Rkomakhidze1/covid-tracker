import { IsNumber, IsOptional } from 'class-validator';
import { Country } from '../../countries/entities/country.entity';

export class CreateStatisticDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  confirmed: number;

  @IsNumber()
  death: number;

  @IsNumber()
  recovered: number;

  @IsOptional()
  country?: Country;
}
