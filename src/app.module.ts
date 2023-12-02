import { Module } from '@nestjs/common';
import { AServerModule } from './a-server/a-server.module';
import { ProductModule } from './product/product.module';
import { TranslateModule } from './product/translate-word/translate-word.module';
import { CategoryModule } from './product/category/category.module';
import { OptionModule } from './product/option/option.module';

@Module({
  imports: [
    AServerModule,
    ProductModule,
    CategoryModule,
    OptionModule,
    TranslateModule,
  ],
})
export class AppModule {}
