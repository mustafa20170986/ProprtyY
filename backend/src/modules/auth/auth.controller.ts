import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sync')
  sync(@Body() body: { clerkId: string; email: string; name: string }) {
    return this.authService.syncUser(body.clerkId, body.email, body.name);
  }
}
