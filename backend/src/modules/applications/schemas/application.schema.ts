import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['agent', 'agency'] })
  requestedRole: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  companyName: string;

  @Prop()
  licenseNumber: string;

  @Prop()
  experience: string;

  @Prop()
  reason: string;

  @Prop({ type: [String] })
  documents: string[];

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: string;

  @Prop()
  adminNote: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
