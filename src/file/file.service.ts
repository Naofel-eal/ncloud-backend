import { forwardRef, Injectable } from '@nestjs/common';
import { File } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { UserService } from '../user/user.service';
import { Inject } from '@nestjs/common/decorators';
import * as bcrypt from 'bcrypt';
import { FolderService } from '../folder/folder.service';
import { secretSalt } from 'src/auth/constants';

@Injectable()
export class FileService {
    constructor(@InjectRepository(File) private fileRepository: Repository<File>,
    @Inject(forwardRef(() => FolderService)) private readonly folderService: FolderService) {}

    @Inject(UserService)
    private readonly userService : UserService;
    //private readonly folderService : FolderService;

    async uploadFile(files: Array<Express.Multer.File>, userID : number, currentFolderID : number) {
        this.checkFile(files, userID);
        
        const salt = secretSalt;
        for(const item of files) {
            const filename = userID + '_' + Date.now().toString() + '_' + item.originalname;
            const type = item.originalname.split('.')[item.originalname.split('.').length-1]
            const size = item.size;
            const myFile = new File()
            myFile.user = await this.userService.getUserByID(userID)
            myFile.name = item.originalname
            myFile.hashedName = await bcrypt.hash(filename, salt.secret) + '.' + type;
            myFile.type = type
            myFile.size = size
            myFile.parentFolder = await this.folderService.getFolderByID(currentFolderID)
            await this.fileRepository.manager.save(myFile);
            return true
        }
    }

    async checkFile(files: Array<Express.Multer.File>, userID : number): Promise<InsertResult> {
        const userData = (await this.userService.getTotalStorage(userID));
        const freeStorage = userData.limit - userData.size;
        return null;
    }

    async deleteFiles(userID : number, filesID : number[]) {
        if(filesID != null) {
            const user = await this.userService.getUserByID(userID);
            if(user == null)
                console.log("USER NULL POUR DELETE")
    
            const filesOfUser = await this.fileRepository
            .createQueryBuilder('file')
            .where('file.userID = :userID', {userID : userID})
            .getMany()
    
            for(let i = 0; i < filesID.length; i++) {
                for(let j = 0; j < filesOfUser.length; j++) {
                    if(filesID[i] == filesOfUser[j].id) 
                    {
                        await this.fileRepository
                        .createQueryBuilder('file')
                        .delete()
                        .from(File)
                        .where("file.id = :id", { id: filesID[i] })
                        .execute()
                    }
                } 
            }
        }
    }

    async deleteFilesFromFolder(folderID) {
        const filesOfFolder = await this.fileRepository
        .createQueryBuilder('file')
        .where('file.parentFolder = :folderID', {folderID : folderID})
        .getMany()

        for(let i = 0; i < filesOfFolder.length; i++) {
                await this.fileRepository
                .createQueryBuilder('file')
                .delete()
                .from(File)
                .where("file.parentFolder = :parentFolder", { parentFolder: filesOfFolder[i] })
                .execute()
        }
    }

    async getFileByID(fileID : number) : Promise<File> {
        const file = await this.fileRepository
        .createQueryBuilder('file')
        .where("file.id = :fileID", { fileID })
        .getOne();

        return file;
    }

    async moveFile(fileID, targetFolder) {
        const file = await this.getFileByID(fileID);
        file.parentFolder = targetFolder;
        await this.fileRepository.save(file)
    }
}