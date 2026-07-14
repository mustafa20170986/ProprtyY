import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOrCreate(clerkId: string, email: string, name?: string) {
    let user = await this.userModel.findOne({ clerkId });
    if (!user) {
      user = await this.userModel.create({ clerkId, email, name, role: 'user' });
    }
    return user;
  }

  async findByClerkId(clerkId: string) {
    return this.userModel.findOne({ clerkId });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async updateRole(userId: string, role: string) {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true });
  }

  async updateProfile(clerkId: string, data: Partial<User>) {
    return this.userModel.findOneAndUpdate({ clerkId }, data, { new: true });
  }

  async getAll() {
    return this.userModel.find().sort({ createdAt: -1 });
  }

  async getAgents() {
    return this.userModel.find({ role: 'agent' });
  }

  async getAgencies() {
    return this.userModel.find({ role: 'agency' });
  }
}
