import { Controller, Body, UseGuards, Post, Get } from "@nestjs/common";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { GroupService } from './group.service';
import CreateGroupDto from '../group/dto/createGroup.dto';

@Controller('groups')
export class GroupController {
    constructor(private groupService : GroupService){}
    
    @UseGuards(LocalAuthGuard)
    @Post('create')
    async createGroup(@Body() group : CreateGroupDto) {
        return this.groupService.createGroup(group);
    }
}