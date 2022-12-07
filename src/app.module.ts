import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { FolderModule } from './folder/folder.module';
import { GroupModule } from './group/group.module';
import  config from './database/database.config'
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [AuthModule, UserModule, FileModule, FolderModule, GroupModule, TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
