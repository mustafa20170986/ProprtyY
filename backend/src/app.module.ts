import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { SavedModule } from './modules/saved/saved.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/propertyx'),
    AuthModule,
    UsersModule,
    PropertiesModule,
    ApplicationsModule,
    SavedModule,
    InquiriesModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
