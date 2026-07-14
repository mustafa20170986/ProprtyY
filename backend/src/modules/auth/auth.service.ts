import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async syncUser(clerkId: string, email: string, name: string) {
    return this.usersService.findOrCreate(clerkId, email, name);
  }
}
