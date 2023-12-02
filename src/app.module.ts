import { Module } from '@nestjs/common';
import { AServerModule } from './a-server/a-server.module';
import { ProductModule } from './product/product.module';
import { TranslateModule } from './product/translate-word/translate-word.module';
import { CategoryModule } from './product/category/category.module';
import { OptionModule } from './product/option/option.module';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: seconds(1),
        limit: 10,
      },
    ]),
    AServerModule,
    ProductModule,
    CategoryModule,
    OptionModule,
    TranslateModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
