import { IsString, IsObject } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  code: string;

  @IsObject()
  name: { en: string; ka: string };
}
