import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderController } from './folder.controller';
import { Folder } from './folder.entity';
import { FolderService } from './folder.service';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';

@Module({
    imports : [TypeOrmModule.forFeature([Folder]), forwardRef(()=>UserModule), forwardRef(() => FileModule)],
    controllers : [FolderController],
    providers: [FolderService],
    exports: [FolderService],
})
export class FolderModule {}
