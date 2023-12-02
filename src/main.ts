import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * [요청 흐름]
 *    - Client <-> Proxy Server <-> A Server
 *
 * [제한 사항]
 *    - A 서버는 각 유저 id마다 초당 최대 10번의 요청만 처리할 수 있습니다.
 *    - Proxy Server는 A 서버의 Rate Limit에 걸리지 않도록 요청을 적절하게 보냅니다.
 *
 * [구현 사항]
 *    - A 서버로 요청 보내기
 *        - [제한 사항]에 있는 [A 서버의 Rate Limit]을 넘기지 않도록 초당 요청이 10회를 초과한다면 Client에게 적절한 Error Message를 보냅니다.
 *    - 상품 카테고리 매칭 (challenge1)
 *        1. Client로부터 productKeyword를 받습니다.
 *            - ProductKeyword: { categoryName: string, productName: string }
 *        2. Client로부터 받은 값을 가지고 Product를 만듭니다.
 *            - Product: { name: string, category: { id: number, name: string } }
 *        3. log를 찍습니다. ( [before]: productKeyword -> [after]: product )
 *        4. 함수를 실행하는 데 걸린 시간을 반환합니다.
 *    - 단어 치환 (challenge2)
 *        1. Client로부터 optionList를 받습니다.
 *            - option: { id: number, name: string }
 *        2. Cleint로부터 받은 값을 가지고 updatedOptionList를 만듭니다.
 *            - updatedOption: { id: number, name: string }
 *        3. log를 찍습니다. ( [before]: optionList -> [after]: updatedOptionList )
 *        4. 함수를 실행하는 데 걸린 시간을 반환합니다.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
