import { UseInterceptors, Request, Controller, UseGuards, Post} from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common/decorators';
import { diskStorage } from 'multer';
import { UserService } from '../user/user.service';


@Controller('files')
export class FileController {
    constructor(private fileService : FileService){}

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', null, {storage: diskStorage({
        destination : './storage',
        filename : (req, file, cb) => {
            let fileName = "";
            const fileNameSplit = file.originalname.split(".");
            for(const item of fileNameSplit) {
                if(item != fileNameSplit[fileNameSplit.length -1])
                    fileName += item;
            }
            const fileExt = fileNameSplit[fileNameSplit.length -1];
            cb(null, fileName + '.' + fileExt);
        }
    })}))
    async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Request() req : any) {
        return this.fileService.uploadFile(files, req.user.id, req.body.currentFolderID);
    }


    @UseGuards(JwtAuthGuard)
    @Post('delete')
    async deleteFiles(@Request() req : any) {
        return await this.fileService.deleteFiles(req.user.id, req.body.filesID)
    }
}