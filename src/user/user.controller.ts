import { Controller, Request, UseGuards, Get, Post } from '@nestjs/common';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private userService : UserService){}

    @Post('registerusername')
    async checkIfValidUsername(@Request() req : any) {
        return this.userService.checkIfValidUsername(req.body.username);
    }

    @Post('registermail')
    async checkIfValidMail(@Request() req : any) {
        return this.userService.checkIfValidMail(req.body.mail);
    
    }

    @Post('register')
    async register(@Request() req : any) {
        return this.userService.register(req.body.name, req.body.firstname, req.body.username, req.body.mail, req.body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('files')
    async getFilesOfUser(@Request() req : any) {
        return this.userService.getFilesOfUser(req.user.id, req.query.parentID);
    }

    @UseGuards(JwtAuthGuard)
    @Get('folders')
    async getFoldersOfUser(@Request() req : any) {
        return this.userService.getFoldersOfUser(req.user.id, req.query.parentID);
    }

    @UseGuards(JwtAuthGuard)
    @Get('rootfolder')
    async getRootFolder(@Request() req : any) {
        return this.userService.getRootFolder(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete')
    async deleteUser(@Request() req : any) {
        return this.userService.deleteUser(req.user.id, req.body.userTargetID);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
}