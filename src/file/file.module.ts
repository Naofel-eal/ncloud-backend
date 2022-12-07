import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './file.entity'
import { UserModule } from '../user/user.module';
import { FolderModule } from '../folder/folder.module';

@Module({
    imports : [TypeOrmModule.forFeature([File]), UserModule, forwardRef(() => FolderModule)],
    controllers : [FileController],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule {}
