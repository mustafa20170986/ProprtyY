import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(@InjectModel(Property.name) private propertyModel: Model<PropertyDocument>) {}

  async create(dto: CreatePropertyDto, ownerId: string, ownerRole: string) {
    return this.propertyModel.create({ ...dto, owner: ownerId, ownerRole });
  }

  async findAll(query: any) {
    const {
      city,
      minPrice,
      maxPrice,
      type,
      listingType,
      bedrooms,
      search,
      lat,
      lng,
      radius = 10,
      page = 1,
      limit = 12,
    } = query;

    const filter: any = {};

    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (type) filter.type = type;
    if (listingType) filter.listingType = listingType;
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }
    if (lat && lng) {
      filter.coordinates = {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius) * 1000,
        },
      };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      this.propertyModel.find(filter).populate('owner').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      this.propertyModel.countDocuments(filter),
    ]);

    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async findOne(id: string) {
    const property = await this.propertyModel.findById(id).populate('owner');
    if (!property) throw new NotFoundException('Property not found');
    // increment views
    await this.propertyModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return property;
  }

  async update(id: string, dto: UpdatePropertyDto, ownerId: string) {
    const prop = await this.propertyModel.findOne({ _id: id, owner: ownerId });
    if (!prop) throw new NotFoundException('Not authorized or not found');
    return this.propertyModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string, ownerId: string) {
    const prop = await this.propertyModel.findOne({ _id: id, owner: ownerId });
    if (!prop) throw new NotFoundException('Not authorized or not found');
    return this.propertyModel.findByIdAndDelete(id);
  }

  async findByOwner(ownerId: string) {
    return this.propertyModel.find({ owner: ownerId }).sort({ createdAt: -1 });
  }

  async compare(ids: string[]) {
    return this.propertyModel.find({ _id: { $in: ids } }).populate('owner');
  }

  async featured() {
    return this.propertyModel.find({ featured: true }).limit(6).populate('owner');
  }
}
