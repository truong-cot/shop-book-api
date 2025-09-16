import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './modules/category/category.module';
import { UploadModule } from './modules/upload/upload.module';
import { AuthorModule } from './modules/author/author.module';
import { PublishingHouseModule } from './modules/publishing-house/publishing-house.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        url: config.get<string>('MONGODB_CONNECTION_STRING'),
        useUnifiedTopology: true,
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),

    CategoryModule,

    UploadModule,

    AuthorModule,

    PublishingHouseModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
