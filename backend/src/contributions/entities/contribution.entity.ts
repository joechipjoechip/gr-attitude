import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import {
  ContributionType,
  ContributionStatus,
} from '../../shared/enums.js';
import { User } from '../../users/entities/user.entity.js';
import { Mission } from '../../missions/entities/mission.entity.js';

@Entity('contributions')
@Unique(['userId', 'missionId', 'type'])
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  missionId: string;

  @Column({ type: 'varchar' })
  type: ContributionType;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({
    type: 'varchar',
    default: ContributionStatus.ACTIVE,
  })
  status: ContributionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.contributions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Mission, (mission) => mission.contributions)
  @JoinColumn({ name: 'missionId' })
  mission: Mission;
}
