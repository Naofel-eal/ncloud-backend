import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from "typeorm";
import { User } from "../user/user.entity";
import { File } from "../file/file.entity"

@Tree('closure-table')
@Entity()
export class Folder extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type => User, user => user.folders)
    userID : User;

    @Column({ length: 500 })
    name : string;

    @OneToMany(() => File, file => file.parentFolder, {onDelete: 'CASCADE'})
    files : File[];

    @TreeChildren({cascade: ['remove']})
    subFolders : Folder[];

    @TreeParent({onDelete: "CASCADE"})
    parentFolder : Folder;
}