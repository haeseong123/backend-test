# 중계 서버

중계 서버는 다음과 같이 동작합니다.

<img width="560" alt="스크린샷 2023-12-06 10 32 44" src="https://github.com/rapidglobal-seokhyeon/backend-test/assets/127168148/67f55578-b779-486c-8414-36747c8dd8c2">

- 클라이언트는 중계 서버에 요청을 보냅니다.
  - request.headers['id']에는 유저 아이다가 포함되어 있습니다.
  ```
  Header: { id: '0000-0000-0000-0000' }
  ```
- 중계 서버는 A 서버에 client의 요청을 전달합니다.
  - 단, A 서버는 userId를 기준으로 초당 10회의 rate limit이 있습니다.
  - 중계 서버는 A 서버의 rate limit을 초과하지 않도록 client의 요청을 적절히 전달합니다.
  - **중계 서버 자체에는 rate limit이 없습니다.**

---

### 작업 내용

#### A 서버로 요청 전달

client가 `/`로 `GET` 요청을 보내면 중계 서버는 해당 요청을 캐싱해 놓습니다.

이때, `key`는 client의 request 헤더에 있는 `id`이며, `value`는 해당 id가 보낸 요청을 담은 `queue`입니다.

코드는 아래와 같습니다.

```typescript
/**
 * src/a-server/a-server.service.ts
 *
 * ID별로 큐에 요청 추가
 */
private async addToQueue(
  dto: AServerRequestDto,
  method: HttpMethod,
): Promise<boolean> {
  // key인 `id`를 통해 value인 `queue`를 가져옵니다.
  const queue = await this.getQueueByIdOrThrow(dto.id);

  const requestDto = new SendRequestDto(this.getUri(dto.path), method, () => {
    throw new InternalServerErrorException(
      `[${dto.id}] ${ErrorMessage.REQUEST_TO_ANOTHER_SERVER_FAILS}`,
    );
  });

  // `queue`에 요청을 추가합니다.
  return queue.offer(requestDto);
}
```

이렇게 쌓인 요청들은 1초마다 수행되도록 설정된 `handleRequestQueues`을 통해 A 서버로 보내집니다.

코드는 아래와 같습니다.

```typescript
/**
 * src/a-server/a-server-request.service.ts
 *
 * idQueues를 순회하며 id를 기준으로 최대 MAX_REQUEST_PER_SECOND 만큼의 요청을 보냅니다.
 *
 * 받은 요청을 id를 기준으로 순차적으로 보냅니다.
 */
private handleRequestQueues() {
  this.promise.then(async () => {
    const keys = await this.cacheManager.store.keys();

    for (const key of keys) {
      const queue = await this.cacheManager.get<Queue<SendRequestDto>>(key);

      if (!queue) {
        continue;
      }

      for (
        let count = 0;
        count < AServerRequestService.MAX_REQUEST_PER_SECOND;
        count++
      ) {
        const sendRequestDto = queue.poll();
        if (!sendRequestDto) {
          break;
        }

        this.rapidHttpService.sendRequest(sendRequestDto);
      }
    }
  });
}
```

---

#### 상품 카테고리 매칭

client가 `/challenge1`로 `GET` 요청을 보내면 중계 서버는 제공된 키워드를 기반으로 카테고리 목록과 매칭하여 상품에 카테고리 정보를 연결합니다.

현재 categoryList에서 name과 매칭되는 category를 찾는 동작의 시간 복잡도는 O(N)입니다.

이것이 너무 길다 싶으면 categoryList를 Map 형태로 변환하여 O(1) 시간에 동작하도록 바꿀 수 있습니다.

단, list를 map으로 변환하는 과정이 O(N)이므로 map을 사용하여서 O(1) 시간에 동작하도록 바꾸려면 한 번 가져온 값을 캐싱하여 사용해야 합니다. (현재 코드는 list를 사용중입니다.)

코드는 아래와 같습니다.

```typescript
// src/product/product.controller.ts
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 외부에서 "/challenge1"을 호출할 수 있도록 API 노출
   */
  @Get('challenge1')
  challenge1(): number {
    const dto: ProductKeywordDto = {
      keyword: '가구',
      name: '예제 상품명',
    };

    return this.productService.challenge1(dto);
  }
}

// src/product/product.service.ts
@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 코딩 테스트 - 1: 상품 카테고리 매칭
   *
   * 목표
   * 상품을 수집할 때
   *    "제공된 키워드를 기반"으로
   *    "카테고리 목록과 매칭"하여
   *    "상품에 카테고리 정보를 연결"
   * 하는 프로세스를 구현합니다.
   *
   * @returns 함수 실행 시간(ms)
   */
  challenge1(dto: ProductKeywordDto): number {
    const start = Date.now();
    /**
     * keyword 기반을 기반으로, 매칭되는 category 가져오기
     * 매칭되는 category가 없다면 Throw
     */
    const category = this.categoryService.findByNameOrThrow(dto.keyword);
    /**
     * 상품에 카테고리 정보를 연결
     */
    const productDto = new ProductDto(dto.name, CategoryDto.of(category));

    this.logger.log('변환된 product');
    this.logger.log(JSON.stringify(productDto));

    const end = Date.now();
    return end - start;
  }
}

// src/product/category/category.service.ts
export class CategoryService {
  constructor() {}

  /**
   * 현재 categoryList에서 name과 매칭되는 category를 찾는 동작의 시간 복잡도는 O(N)
   *
   * 이것이 너무 길다 싶으면 categoryList를 Map 형태로 변환하여 O(1) 시간에 동작하도록 바꿀 수 있음
   * 단, list를 map으로 변환하는 과정이 O(N)이므로 한 번 가져온 값을 캐싱하여 사용해야 함
   *
   * @param name 카테고리 이름
   * @returns 매칭된 카테고리
   */
  findByNameOrThrow(name: string): Category {
    const categoryList = this.findAll();
    const category = categoryList.find((category) => category.name === name);

    if (!category) {
      throw new BadRequestException(ErrorMessage.CATEGORY_KEYWORD_NOT_MATCHED);
    }

    return category;
  }

  /**
   * 실사용 시 repository를 사용하여
   * DB에 있는 category를 전부 가져오는 방식으로 동작
   *
   * @returns categoryList
   */
  findAll(): Category[] {
    const categoryList: Category[] = [
      { id: 1, name: '가구' },
      { id: 2, name: '공구' },
      { id: 3, name: '의류' },
    ];
    [...new Array(10000)].forEach((_, index) => {
      categoryList.push({ id: index + 4, name: `카테고리${index + 4}` });
    });

    return categoryList;
  }
}
```

---

#### 단어 치환

client가 `/challenge2`로 `GET` 요청을 보내면 중계 서버는 옵션 이름에 나타난 특정 단어들을 주어진 단어 치환 목록을 사용하여 변경합니다.

현재 replaceAll 메서드를 사용하여 해당 작업을 처리하고 있습니다.

시간을 단축하고 싶다면 KMP 알고리즘을 고려해 볼 수 있습니다. (현재 코드는 replaceAll를 사용중입니다.)

코드는 아래와 같습니다.

```typescript
// src/product/option/option.controller.ts
@Controller()
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  /**
   * 외부에서 "/challenge2"를 호출할 수 있도록 API 노출
   */
  @Get('challenge2')
  challenge2(): number {
    const dtos: OptionDto[] = [
      { id: 1, name: '블랙 XL' },
      { id: 2, name: '블랙 L' },
      { id: 3, name: '블랙 M' },
      { id: 4, name: '레드 XL' },
      { id: 5, name: '레드 L' },
      { id: 6, name: '레드 M' },
    ];
    [...new Array(50)].forEach((_, index) => {
      dtos.push({ id: index + 7, name: `블랙${index + 7}` });
    });

    return this.optionService.challenge2(dtos);
  }
}

// src/product/option/option.service.ts
@Injectable()
export class OptionService {
  private readonly logger = new Logger(OptionService.name);
  constructor(private readonly translateWordService: TranslateWordService) {}

  /**
   * 코딩 테스트 - 2: 단어 치환
   *
   * <목표>
   *    옵션 이름에 나타난
   *      "특정 단어"들을
   *      주어진 "단어 치환 목록"을 사용하여
   *    변경합니다.
   *
   * @returns 함수 실행 시간(ms)
   */
  challenge2(dtos: OptionDto[]): number {
    const start = Date.now();
    /**
     * translateWordList 가져오기
     */
    const translateWordList = this.translateWordService.findAll();
    const updatedOptionList: UpdatedOptionDto[] = [];

    for (const dto of dtos) {
      let updatedName = dto.name;
      for (const translateWord of translateWordList) {
        updatedName = updatedName.replaceAll(
          translateWord.src,
          translateWord.dest,
        );
      }

      updatedOptionList.push(new UpdatedOptionDto(dto.id, updatedName));
    }

    this.logger.log('변환된 optionList');
    this.logger.log(JSON.stringify(updatedOptionList));

    const end = Date.now();
    return end - start;
  }
}

// src/product/translate-word/translate.service.ts
@Injectable()
export class TranslateWordService {
  constructor() {}

  /**
   * 실사용 시 repository를 사용하여
   * DB에 있는 translateWord를 전부 가져오는 방식으로 동작
   *
   * @returns translateWordList
   */
  findAll(): TranslateWord[] {
    const translateWordList: TranslateWord[] = [
      { src: '블랙', dest: '검정색' },
      { src: '레드', dest: '빨간색' },
    ];
    [...new Array(10000)].forEach((_, index) => {
      translateWordList.push({ src: index.toString(), dest: `A` });
    });

    return translateWordList;
  }
}
```

---

#### 일관적 응답을 위해 ResponseInterceptor 작성

일관적 응답을 위해 아래처럼 ResponseInterceptor를 작성했습니다.

```typescript
// src/common/interceptor/response.interceptor.ts
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, Record<string, any>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Record<string, any>> {
    return next.handle().pipe(
      map((result: T) => {
        const statusCode =
          context.switchToHttp().getResponse<Response>().statusCode || 200;
        const message = this.getMessageFromStatusCode(statusCode);
        const successResponse: RapidResponse<T> = {
          statusCode,
          message,
          result,
        };

        return instanceToPlain(successResponse);
      }),
    );
  }
}
```

---

#### unit test

코드 검증을 위해 unit test를 작성했습니다. unit test 파일들은 `test/unit`에 위치해 있으며, 아래 명령어를 통해 실행할 수 있습니다.

```bash
npm run test
```

---

#### 서버 실행

의존성 패키지를 설치한 후

```bash
npm i
```

서버를 실행할 수 있습니다.

```bash
npm run start
```
