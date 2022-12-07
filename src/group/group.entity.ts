import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { User } from '../user/user.entity';

@Entity()
export class Group extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ length: 500 })
    name : string;

    @Column()
    storageLimit :  number;

    @ManyToMany( () => User, user => user.groups )
    @JoinTable()
    users : User[];

    @OneToMany(() => User, user => user.groupsOwner)
    administrator : User; 
}