import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { File } from '../file/file.entity';
import { Folder } from '../folder/folder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { secretSalt } from '../auth/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
  @InjectRepository(Folder) private folderRepository: Repository<Folder>

  async checkIfValidUsername(username : string) : Promise<Boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where("user.username = :username", { username })
      .getOne();
      if(user == null)
        return true;
      else
        return false
  }

  async checkIfValidMail(mail : string) : Promise<Boolean> {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(mail))
    {
      const user = await this.userRepository
      .createQueryBuilder('user')
      .where("user.mail = :mail", { mail })
      .getOne();
      if(user == null)
        return true;
      else
        return false
    }
    else
      return false;
  }

  async register(name : string, firstname : string, username:string, mail:string, password:string ) {
    const insertUser = await this.userRepository
    .createQueryBuilder('user')
    .insert()
    .into(User)
    .values ({
        name: name,
        firstname : firstname,
        username : username,
        mail : mail,
        password : await bcrypt.hash(password, secretSalt.secret),
        lastConnexion :"",
        storageLimit : 1000000000,
        rootFolder : null,
        files : null,
        folders : null,
        groups : null,
        groupsOwner : null,
    })
    .execute().catch(error => {console.log(error)});

    const userObject = await this.getUser(username);
    if(userObject == null)
      console.log("Erreur creation userObject")

    const insertRootFolder = await this.userRepository
    .createQueryBuilder('folder')
    .insert()
    .into(Folder)
    .values({
      name: '/',
      userID: userObject
    })
    .execute().catch(error => {console.log("insertRootFolder : "+error)});
        

    const rootFolder = await this.folderRepository
    .createQueryBuilder('folder')
    .innerJoinAndSelect('folder.userID', "user")
    .where("folder.userID = :id", {id: userObject.id})
    .andWhere("folder.name = :name", {name: '/'})
    .getOne()
    if(rootFolder == null)
      console.log("Erreur creation rootfolder")

    const insertRootFolderInUser = await this.userRepository
    .createQueryBuilder('user')
    .update()
    .set({rootFolder : rootFolder})
    .where("id = :id", {id: userObject.id})
    .execute().catch(error => {console.log(error)})

    return insertRootFolderInUser;
    
  }

  async getFilesOfUser(userID : number, parentFolderID : number) : Promise<File[]> {  
    const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.files', "file")
        .where("user.id = :id", { id: userID})
        .where("file.parentFolder =  :id", {id: parentFolderID})
        .getOne()
    if(user == null)
        return null;
    else
      return await user.files;
  }

  async getFoldersOfUser(userID : number, parentFolderID) : Promise<Folder[]> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.folders', "folder")
      .where("user.id = :id", { id: userID})
      .where("folder.parentFolder = :id", {id: parentFolderID})
      .getOne()
    if(user == null)
      return null;
    else
      return await user.folders;
  }

  async getUser(username: string) : Promise<User | undefined> {  
    const user = await this.userRepository
    .createQueryBuilder('user')
    .where("user.username = :username", { username })
    .getOne();
    
    return user;
  }
  
  async getUserByID(userID: number) : Promise<User | undefined> {  
    const user = await this.userRepository
    .createQueryBuilder('user')
    .where("user.id = :userID", { userID })
    .getOne();
    
    return user;
  }

  async getAllUsers() : Promise<any>{
    const users = await this.userRepository
    .createQueryBuilder('allUsers')
    .getMany()

    return users.map(({password, ...item}) => item);
  }

  async getRootFolder(userID : number) : Promise<any> {
    const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.rootFolder', "folder")
        .where("user.id =  :id", {id: userID})
        .getOne()
    if(user == null)
        return null;
    else
      return await user.rootFolder.id;
  }
  
  async getTotalStorage(userID : number) : Promise<any> {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .where("id = :id", {id: userID})
    .getOne()

    const limit = user.storageLimit;
    let sizeSum = 0;
    if(user.files == null)
      return {size : 0, limit : limit}
    for(const file of  user.files) {
      sizeSum += file.size;
    }
    return {size : sizeSum, limit: limit};
  }

  async deleteUser(userID : number, userTargetID : number) {
    
  }
}
