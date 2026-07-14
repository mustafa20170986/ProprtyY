import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({ _id: false })
class Location {
  @Prop({ required: true })
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  zipCode: string;
}

@Schema({ _id: false })
class Coordinates {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;
}

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['apartment', 'house', 'villa', 'land', 'commercial'] })
  type: string;

  @Prop({ required: true, enum: ['sale', 'rent'] })
  listingType: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  pricePerSqft: number;

  @Prop({ required: true })
  bedrooms: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({ required: true })
  area: number; // sqft

  @Prop({ type: Location, required: true })
  location: Location;

  @Prop({ type: Coordinates, required: true })
  coordinates: Coordinates;

  @Prop({ type: [String] })
  amenities: string[];

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ enum: ['user', 'seller', 'agent', 'agency'], default: 'user' })
  ownerRole: string;

  @Prop({ default: 'available', enum: ['available', 'sold', 'rented', 'pending'] })
  status: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  interestedCount: number;

  @Prop({ default: 5 })
  commissionPercent: number; // for agent

  @Prop({ default: false })
  featured: boolean;

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  yearBuilt: number;

  @Prop({ default: true })
  isVerified: boolean;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
PropertySchema.index({ 'location.city': 1, price: 1, type: 1 });
PropertySchema.index({ coordinates: '2dsphere' });
