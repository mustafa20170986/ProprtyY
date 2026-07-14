import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from '../properties/schemas/property.schema';
import { Inquiry } from '../inquiries/schemas/inquiry.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    @InjectModel(Inquiry.name) private inquiryModel: Model<Inquiry>,
  ) {}

  async getAgentStats(ownerId: string) {
    const properties = await this.propertyModel.find({ owner: ownerId });
    const inquiries = await this.inquiryModel.find({ sellerId: ownerId });

    const totalRevenue = properties.reduce((sum, p) => sum + p.price * 0.05, 0); // mock 5%
    const monthlyData = [
      { month: 'Jan', revenue: totalRevenue * 0.1, commission: totalRevenue * 0.02 },
      { month: 'Feb', revenue: totalRevenue * 0.15, commission: totalRevenue * 0.03 },
      { month: 'Mar', revenue: totalRevenue * 0.2, commission: totalRevenue * 0.04 },
      { month: 'Apr', revenue: totalRevenue * 0.25, commission: totalRevenue * 0.05 },
      { month: 'May', revenue: totalRevenue * 0.3, commission: totalRevenue * 0.06 },
      { month: 'Jun', revenue: totalRevenue * 0.35, commission: totalRevenue * 0.07 },
    ];

    return {
      totalProperties: properties.length,
      totalInquiries: inquiries.length,
      totalRevenue,
      totalCommission: totalRevenue * 0.2,
      avgCommission: 5.2,
      monthlyData,
      recentInquiries: inquiries.slice(0, 5),
    };
  }

  async getAdminStats() {
    const totalProperties = await this.propertyModel.countDocuments();
    const totalInquiries = await this.inquiryModel.countDocuments();
    const available = await this.propertyModel.countDocuments({ status: 'available' });
    const sold = await this.propertyModel.countDocuments({ status: 'sold' });

    return {
      totalProperties,
      totalInquiries,
      available,
      sold,
      revenue: totalProperties * 5000,
    };
  }
}
