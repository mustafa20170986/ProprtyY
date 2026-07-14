import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private appModel: Model<ApplicationDocument>,
    private usersService: UsersService,
  ) {}

  async create(data: any) {
    return this.appModel.create(data);
  }

  async findAll() {
    return this.appModel.find().populate('userId').sort({ createdAt: -1 });
  }

  async approve(id: string) {
    const app = await this.appModel.findById(id);
    if (!app) throw new Error('Not found');
    app.status = 'approved';
    await app.save();
    // update user role
    await this.usersService.updateRole(app.userId.toString(), app.requestedRole);
    return app;
  }

  async reject(id: string, note: string) {
    const app = await this.appModel.findByIdAndUpdate(id, { status: 'rejected', adminNote: note }, { new: true });
    return app;
  }

  async findByUser(userId: string) {
    return this.appModel.find({ userId });
  }
}
