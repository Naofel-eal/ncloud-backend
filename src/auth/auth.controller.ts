import { Controller, UseGuards, Post, Request } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    
    constructor(private authService : AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}