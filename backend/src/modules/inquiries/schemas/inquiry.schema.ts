import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InquiryDocument = Inquiry & Document;

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  propertyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ enum: ['interested', 'tour'], required: true })
  type: string;

  @Prop()
  message: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  preferredDate: Date;

  @Prop({ default: 'pending', enum: ['pending', 'contacted', 'closed'] })
  status: string;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
