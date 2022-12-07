import { Injectable } from '@nestjs/common';
import CreateGroupDto from './dto/createGroup.dto';
import { Group } from './group.entity';

@Injectable()
export class GroupService {

    async createGroup(groupDetails : CreateGroupDto) : Promise<Group> {
        const groupEntity : Group = Group.create();
        groupEntity.name = groupDetails.name;
        groupEntity.storageLimit = groupDetails.storageLimit;
        await Group.save(groupEntity);
        return groupEntity;
    }
}