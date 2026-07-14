import { IsString, IsNumber, IsArray, IsEnum, IsObject, IsOptional } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['apartment', 'house', 'villa', 'land', 'commercial'])
  type: string;

  @IsEnum(['sale', 'rent'])
  listingType: string;

  @IsNumber()
  price: number;

  @IsNumber()
  bedrooms: number;

  @IsNumber()
  bathrooms: number;

  @IsNumber()
  area: number;

  @IsObject()
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @IsObject()
  coordinates: { lat: number; lng: number };

  @IsArray()
  @IsOptional()
  amenities: string[];

  @IsArray()
  images: string[];

  @IsNumber()
  @IsOptional()
  commissionPercent: number;

  @IsNumber()
  @IsOptional()
  yearBuilt: number;

  @IsArray()
  @IsOptional()
  tags: string[];
}
