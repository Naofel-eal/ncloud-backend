import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToMany, JoinTable, ManyToOne, OneToOne, JoinColumn} from "typeorm";
import { File } from '../file/file.entity'
import { Folder } from "../folder/folder.entity";
import { Group } from "../group/group.entity";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    username : string;

    @Column({length: 500})
    mail : string;

    @Column({ length: 500 })
    name : string;

    @Column({ length: 500 })
    firstname : string;
    
    @Column()
    password : string;

    @Column()
    lastConnexion : string;

    @Column()
    storageLimit : number;

    @OneToOne(() => Folder, folder => folder.userID)
    @JoinColumn()
    rootFolder :  Folder;

    @OneToMany(() => File, file => file.user)
    files : File[];

    @OneToMany(() => Folder, folder => folder.userID)
    folders : Folder[];

    @ManyToMany(() => Group, group => group.users)
    @JoinTable()
    groups : Group[];

    @ManyToOne(() => Group, group => group.administrator)
    groupsOwner : Group[];
}