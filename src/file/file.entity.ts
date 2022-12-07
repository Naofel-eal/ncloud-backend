import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { User } from '../user/user.entity'
import { Folder } from '../folder/folder.entity';

@Entity()
export class File extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type => User, user => user.files)
    user : User;

    @Column({ length: 500 })
    name : string;

    @Column()
    hashedName : string;

    @Column()
    type : string;

    @Column()
    size : number;

    @ManyToOne(() => Folder, folder => folder.files, {onDelete : 'CASCADE'} )
    parentFolder : Folder;
}