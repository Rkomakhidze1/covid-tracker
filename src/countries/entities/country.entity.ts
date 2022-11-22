import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'simple-json' })
  name: string;
}
