import { Controller, UseGuards, Post, Get, Request } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { InsertResult } from "typeorm";
import { Folder } from "./folder.entity";
import { FolderService } from './folder.service';

@Controller('folders')
export class FolderController {
    constructor(private folderService : FolderService){}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createFolder(@Request() req : any) : Promise<Folder> {
        return await this.folderService.createFolder(req.user.id, req.body.folderName, req.body.parentFolderID);
    }

    @UseGuards(JwtAuthGuard)
    @Get('files')
    async getFilesOfFolder(folderID : number) {
        return await this.folderService.getFilesOfFolder(folderID);
    }

    @UseGuards(JwtAuthGuard)
    @Get('folders')
    async getFoldersOfFolder(folderID : number) {
        return await this.folderService.getFoldersOfFolder(folderID);
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete')
    async deleteFolders(@Request() req: any) {
        return await this.folderService.deleteFolders(req.user.id, req.body.foldersID)
    }

    @UseGuards(JwtAuthGuard)
    @Post('move')
    async moveFoldersAndFiles(@Request() req:any) {
        console.log("MOVING")
        return await this.folderService.moveFoldersAndFiles(req.user.id, req.body.selectedFoldersID, req.body.selectedFilesID, req.body.targetFolderID);
    }
}