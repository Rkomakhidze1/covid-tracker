import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Country } from '../../countries/entities/country.entity';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  confirmed: number;

  @Column()
  death: number;

  @Column()
  recovered: number;

  @JoinColumn()
  @OneToOne(() => Country)
  country: Country;

  @Column()
  countryId?: number;
}
