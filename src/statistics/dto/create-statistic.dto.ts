import { IsNumber } from 'class-validator';

export class CreateStatisticDto {
  @IsNumber()
  confirmed: number;

  @IsNumber()
  death: number;

  @IsNumber()
  recovered: number;
}
