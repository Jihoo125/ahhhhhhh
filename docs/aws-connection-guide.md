# NoteFlow 웹사이트를 AWS와 연결하는 방법

## 1. 목표 구성
- **정적 프론트엔드**: S3 + CloudFront
- **API**: API Gateway
- **비즈니스 로직**: AWS Lambda
- **저장소**: DynamoDB
- **인증(선택)**: Amazon Cognito

## 2. 프론트엔드 배포
1. S3 버킷을 생성한다.
2. `index.html`, `styles.css`, `script.js`, `aws-config.example.js`를 업로드한다.
3. 실제 배포 시에는 `aws-config.example.js`를 `aws-config.js` 같은 실제 설정 파일로 복사해 사용한다.
4. CloudFront 배포를 생성하고 S3 버킷을 오리진으로 연결한다.

## 3. API Gateway + Lambda 연결
프론트엔드 폼은 아래 엔드포인트로 POST 요청을 보내도록 구현되어 있다.

- `POST /waitlist`

예시 Lambda 입력 payload:
```json
{
  "name": "홍길동",
  "email": "team@example.com",
  "interest": "팀 협업 노트"
}
```

### 예시 Lambda(Node.js)
```js
export const handler = async (event) => {
  const body = JSON.parse(event.body || '{}');

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
    },
    body: JSON.stringify({ ok: true, received: body }),
  };
};
```

### DynamoDB 저장까지 확장하려면
- Lambda에 `PutItem` 또는 AWS SDK v3 `PutCommand`를 추가한다.
- 파티션 키 예시: `requestId`
- 속성 예시: `name`, `email`, `interest`, `createdAt`

## 4. 프론트엔드 설정
`aws-config.example.js`를 기반으로 실제 값 입력:

```js
window.NOTEFLOW_CONFIG = {
  apiBaseUrl: 'https://abcd1234.execute-api.ap-northeast-2.amazonaws.com/prod',
  apiKey: '',
  cognito: {
    userPoolId: 'ap-northeast-2_XXXXXXX',
    userPoolClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    region: 'ap-northeast-2',
  },
};
```

현재 `script.js`는 `apiBaseUrl`이 설정되면 아래처럼 호출한다.
- `fetch(${apiBaseUrl}/waitlist, { method: 'POST', body: ... })`

## 5. Cognito 로그인으로 확장
다음 단계로는 아래 둘 중 하나를 권장한다.
- **가볍게 시작**: Hosted UI 사용
- **본격 구현**: AWS Amplify 또는 Amazon Cognito Identity SDK 연동

로그인 후 액세스 토큰을 받아 보호된 API Gateway Authorizer와 연결하면 된다.

## 6. CORS 체크리스트
API Gateway / Lambda 응답에 최소한 아래 헤더가 있어야 한다.
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Methods`

## 7. 추천 실제 배포 순서
1. S3 + CloudFront로 사이트 배포
2. API Gateway + Lambda로 `/waitlist` 구현
3. DynamoDB 저장 추가
4. Cognito 인증 붙이기
5. 메모 CRUD API(`/notes`) 확장

## 8. 다음에 바로 구현할 수 있는 항목
- 문의 폼 대신 실제 회원가입/로그인 연동
- `/notes` CRUD 화면 추가
- S3 이미지 업로드 연결
- OpenSearch 검색 연결
