import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { loggerConfig } from './config/logger.config';
import { AppDataSource } from './config/database.config';

import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { AuthGuard } from './auth/auth.guard';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
    }),
    AuthModule,
    OrderModule,
    ProductModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
