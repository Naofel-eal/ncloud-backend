import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FolderModule } from 'src/folder/folder.module';
import { Folder } from 'src/folder/folder.entity';

@Module({
  imports : [TypeOrmModule.forFeature([User]), forwardRef(()=>FolderModule), TypeOrmModule.forFeature([Folder])],
  controllers : [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
