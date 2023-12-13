import { Module } from '@nestjs/common';
import { AServerModule } from './a-server/a-server.module';
import { ProductModule } from './product/product.module';
import { TranslateModule } from './product/translate-word/translate-word.module';
import { CategoryModule } from './product/category/category.module';
import { OptionModule } from './product/option/option.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './common/cron/cron.module';
import { RapidHttpModule } from './common/rapid-http/rapid-http.module';
import { CacheModule } from '@nestjs/cache-manager';
import { IdBasedHttpRequestInterceptor } from './common/interceptor/id-based-http-request.interceptor';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ScheduleModule.forRoot(),
    CronModule,
    RapidHttpModule,
    AServerModule,
    ProductModule,
    CategoryModule,
    OptionModule,
    TranslateModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: IdBasedHttpRequestInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
