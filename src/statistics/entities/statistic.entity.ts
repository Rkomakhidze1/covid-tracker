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

  @JoinColumn({ name: 'country_id' })
  @OneToOne(() => Country)
  country: Country;

  @Column({ name: 'country_id' })
  countryId?: number;
}
