import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  clerkId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  avatar: string;

  @Prop({
    type: String,
    enum: ['user', 'seller', 'agent', 'agency', 'admin'],
    default: 'user',
  })
  role: string;

  @Prop({ default: 0 })
  totalRevenue: number;

  @Prop({ default: 0 })
  totalCommission: number;

  @Prop({ type: Object })
  revenueHistory: {
    month: string;
    revenue: number;
    commission: number;
  }[];

  @Prop({ default: true })
  isActive: boolean;

  // Agency specific
  @Prop()
  companyName: string;

  @Prop()
  companyLogo: string;

  @Prop()
  licenseNumber: string;

  @Prop({ type: [String] })
  agentIds: string[]; // for agency managing agents
}

export const UserSchema = SchemaFactory.createForClass(User);
