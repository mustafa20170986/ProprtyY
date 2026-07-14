import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Saved, SavedDocument } from './schemas/saved.schema';

@Injectable()
export class SavedService {
  constructor(@InjectModel(Saved.name) private savedModel: Model<SavedDocument>) {}

  async toggle(userId: string, propertyId: string) {
    const existing = await this.savedModel.findOne({ userId, propertyId });
    if (existing) {
      await this.savedModel.findByIdAndDelete(existing._id);
      return { saved: false };
    }
    await this.savedModel.create({ userId, propertyId });
    return { saved: true };
  }

  async findByUser(userId: string) {
    return this.savedModel.find({ userId }).populate('propertyId');
  }
}
