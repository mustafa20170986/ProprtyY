import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument } from './schemas/inquiry.schema';

@Injectable()
export class InquiriesService {
  constructor(@InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>) {}

  async create(data: any) {
    return this.inquiryModel.create(data);
  }

  async findBySeller(sellerId: string) {
    return this.inquiryModel.find({ sellerId }).populate('propertyId buyerId').sort({ createdAt: -1 });
  }

  async findByBuyer(buyerId: string) {
    return this.inquiryModel.find({ buyerId }).populate('propertyId').sort({ createdAt: -1 });
  }

  async findAll() {
    return this.inquiryModel.find().populate('propertyId buyerId sellerId');
  }
}
