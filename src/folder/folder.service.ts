import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Folder } from './folder.entity';
import { File } from '../file/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult, getTreeRepository, getManager } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { FileService } from '../file/file.service';


@Injectable()
export class FolderService {
    constructor(@InjectRepository(Folder) private folderRepository: Repository<Folder>,
    @Inject(forwardRef(() => FileService))
    private fileService: FileService,
    ) {}
    @Inject(UserService)
    private readonly userService : UserService;

   // private fileService : FileService;
    
    async createFolder(userID : number, folderName: string, parentFolderID : number): Promise<Folder> {
        const user = await this.userService.getUserByID(userID);
        const parentFolder = await this.getFolderByID(parentFolderID);
        const folder = new Folder();
        folder.userID = user;
        folder.name = folderName;
        folder.files = [];
        folder.subFolders = [];
        folder.parentFolder = parentFolder;
        await this.folderRepository.manager.save(folder)
        return folder;
    }

    async getFilesOfFolder(folderID : number) : Promise<File[]> {
        const folder = await this.folderRepository
        .createQueryBuilder('getFilesOfFolder')
        .where("folder.id = :folderID" , {folderID})
        .getOne()
        
        return (await folder).files;
    }

    async getFoldersOfFolder(folderID : number) : Promise<Folder[]> {
        const folder = await this.folderRepository
        .createQueryBuilder('getFoldersOfFolder')
        .where("folder.id = :folderID" , {folderID})
        .getOne()
        
        return await folder.subFolders;
    }

    async getFolderByID(folderID : number) : Promise<Folder> {
        const folder = await this.folderRepository
        .createQueryBuilder('folder')
        .leftJoinAndSelect('folder.userID', 'user')
        .leftJoinAndSelect('folder.files', 'files')
        .leftJoinAndSelect('folder.subFolders', 'subFolders')
        .leftJoinAndSelect('folder.parentFolder', 'parentFolder')
        .where("folder.id = :folderID", { folderID })
        .getOne();

        return folder;
    }

    async deleteFolders(userID : number, foldersID : number[]) {
        const user = await this.userService.getUserByID(userID)
        if(user === null)
            throw new ForbiddenException("USER NOT FOUND")

        for(const folderID of foldersID) {
            const folder = await this.getFolderByID(folderID)
            if(folder.userID.id === user.id)
                await this.folderRepository.remove(folder)
            else
                console.log("NOT GOOD USER")
        }      
    }

    async getSubFoldersOfFolder(parentFolder : Folder) : Promise<Folder[]>{
        const subFolders = await this.folderRepository
        .createQueryBuilder('folder')
        .select()
        .where("folder.parentFolder = :parentFolderID", { parentFolderID : parentFolder.id})
        .getMany()
        return subFolders;
    }

    async moveFoldersAndFiles(userID, selectedFoldersID, selectedFilesID, targetFolderID) {
        if(selectedFoldersID.length == 0 && selectedFilesID.length == 0)
            return null
        
        const user = await this.userService.getUserByID(userID)
        if(user === null)
            throw new ForbiddenException("USER NOT FOUND")
        
        const targetFolder = await this.getFolderByID(targetFolderID);

        for(const folderID of selectedFoldersID) {
            console.log("Dossier: ", folderID, "target", targetFolderID)
            await this.folderRepository.createQueryBuilder()
            .update(Folder)
            .set({parentFolder: targetFolder})
            .where("id = :folderID", {folderID})
            .execute  
        }

        for(const fileID of selectedFilesID) {
            console.log(fileID, targetFolderID)
            console.log(this.fileService)
            await this.fileService.moveFile(fileID, targetFolderID)

        }
        
    }
}