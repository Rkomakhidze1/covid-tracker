import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  confirmed: number;

  @Column()
  death: number;

  @Column()
  recovered: number;
}
