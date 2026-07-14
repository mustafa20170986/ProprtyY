import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SavedDocument = Saved & Document;

@Schema({ timestamps: true })
export class Saved {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  propertyId: Types.ObjectId;
}

export const SavedSchema = SchemaFactory.createForClass(Saved);
SavedSchema.index({ userId: 1, propertyId: 1 }, { unique: true });
