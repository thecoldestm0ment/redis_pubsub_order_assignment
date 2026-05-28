# 마지막 주차 과제: Redis Pub/Sub 기반 주문 이벤트 처리

## 1. 과제 목표

이번 과제의 목표는 Redis Pub/Sub 구조를 직접 실험해보는 것이다.

쇼핑몰에서 주문이 들어오면 하나의 주문 이벤트가 발생한다.  
이 주문 이벤트를 Redis의 `orders` channel로 발행한다.

`orders` channel을 구독 중인 서비스는 3개이다.

- 재고 서비스
- 배송 서비스
- 알림 서비스

각 서비스는 같은 주문 이벤트를 받지만, 처리 내용은 다르다.

```text
주문 발생
→ Publisher가 orders channel에 publish
→ 재고 서비스가 수신
→ 배송 서비스가 수신
→ 알림 서비스가 수신
```

이번 과제에서는 실제 DB를 사용하지 않는다.  
메모리 변수와 로그 출력으로 각 서비스가 처리했다고 가정한다.

---

## 2. 실습 전 준비

### 2-1. Node.js 설치 확인

터미널에서 확인한다.

```bash
node --version
npm --version
```

버전이 출력되면 Node.js와 npm이 설치된 상태이다.

---

### 2-2. Redis 실행

Docker Desktop을 실행한 뒤 터미널에서 Redis container를 실행한다.

```bash
docker run --name redis-pubsub -p 6379:6379 -d redis:latest
```

이미 같은 이름의 container가 있다면 아래 명령어를 사용한다.

```bash
docker start redis-pubsub
```

Redis가 실행 중인지 확인한다.

```bash
docker ps
```

`redis-pubsub`이 보이면 성공이다.

---

### 2-3. 패키지 설치

과제 폴더에서 아래 명령어를 실행한다.

```bash
npm install
```

---

### 2-4. Redis 연결 테스트

아래 명령어를 실행한다.

```bash
npm run test:redis
```

정상 실행 예시:

```text
Redis 연결 성공
SET/GET 테스트 결과: hello-redis
테스트 완료
```

이 단계가 실패하면 Redis 실행 상태와 Docker Desktop 실행 여부를 먼저 확인한다.

---

## 3. 파일 구조

```text
redis_pubsub_order_assignment/
├─ package.json
├─ README.md
├─ REPORT_TEMPLATE.md
├─ tools/
│  └─ check-assignment.js
└─ src/
   ├─ redisClient.js
   ├─ test-redis.js
   ├─ order-publisher.js
   ├─ utils/
   │  ├─ parseOrderEvent.js
   │  └─ todo.js
   └─ subscribers/
      ├─ inventory-subscriber.js
      ├─ delivery-subscriber.js
      └─ notification-subscriber.js
```

`src/` 아래 파일은 학생용 skeleton이다.  
구현 전에는 `npm run pub`, `npm run sub:*` 실행 시 TODO 오류가 나는 것이 정상이다.

기본 유틸 빠른 점검:

```bash
npm run check:assignment
```

이 스크립트는 `parseOrderEvent.js`의 기본 검증 로직만 확인한다.

---

## 4. 구현해야 할 내용

## Step 1. Publisher 구현

파일:

```text
src/order-publisher.js
```

Publisher는 주문 이벤트를 만든 뒤 Redis의 `orders` channel로 발행한다.

주문 이벤트는 JSON 형식으로 보낸다.

예시:

```json
{
  "orderId": "ORD-001",
  "productName": "keyboard",
  "quantity": 2,
  "orderedAt": "2026-05-28T10:00:00.000Z"
}
```

해야 할 일:

- TODO 1: 주문 이벤트 객체 완성
- TODO 2: 주문 이벤트를 JSON 문자열로 변환
- TODO 3: `orders` channel에 publish
- TODO 4: publish 결과로 나온 subscriber 수 출력

실행:

```bash
npm run pub
```

---

## Step 2. Inventory Subscriber 구현

파일:

```text
src/subscribers/inventory-subscriber.js
```

재고 서비스는 주문 이벤트를 받으면 상품 수량만큼 재고를 차감했다고 가정한다.

실제 DB를 사용하지 않는다.  
메모리 객체 `stockTable`을 사용한다.

출력 예시:

```text
[재고 서비스] keyboard 재고 2개 차감
[재고 서비스] 현재 keyboard 재고: 98
```

해야 할 일:

- TODO 1: 주문 이벤트에서 `productName`, `quantity` 꺼내기
- TODO 2: 재고 차감
- TODO 3: 로그 출력

실행:

```bash
npm run sub:inventory
```

---

## Step 3. Delivery Subscriber 구현

파일:

```text
src/subscribers/delivery-subscriber.js
```

배송 서비스는 주문 이벤트를 받으면 배송 대기 목록에 추가했다고 가정한다.

실제 DB를 사용하지 않는다.  
메모리 배열 `deliveryQueue`를 사용한다.

출력 예시:

```text
[배송 서비스] ORD-001 배송 등록 완료
[배송 서비스] 배송 대기 수: 1
```

해야 할 일:

- TODO 1: 배송 대기 목록에 주문 추가
- TODO 2: 배송 등록 로그 출력
- TODO 3: 현재 배송 대기 수 출력

실행:

```bash
npm run sub:delivery
```

---

## Step 4. Notification Subscriber 구현

파일:

```text
src/subscribers/notification-subscriber.js
```

알림 서비스는 주문 이벤트를 받으면 주문번호와 상품명을 포함한 주문 접수 알림을 보냈다고 가정한다.

출력 예시:

```text
[알림 서비스] ORD-001 주문이 접수되었습니다. 상품: keyboard
```

해야 할 일:

- TODO 1: 주문번호와 상품명을 사용해 알림 메시지 만들기
- TODO 2: 로그 출력

실행:

```bash
npm run sub:notification
```

---

## 5. 실행 방법

터미널을 4개 연다.

### 터미널 1

```bash
npm run sub:inventory
```

### 터미널 2

```bash
npm run sub:delivery
```

### 터미널 3

```bash
npm run sub:notification
```

### 터미널 4

```bash
npm run pub
```

정상 동작한다면 subscriber 3개가 모두 같은 주문 이벤트를 받는다.

---

## 6. 반드시 해볼 실험

### 실험 1. subscriber 3개 모두 켠 상태

1. 재고 서비스 실행
2. 배송 서비스 실행
3. 알림 서비스 실행
4. publisher 실행

확인할 것:

```text
주문 이벤트 하나를 publish했을 때 subscriber 3개가 모두 메시지를 받는가?
```

---

### 실험 2. subscriber 하나를 꺼놓은 상태

1. 재고 서비스 실행
2. 배송 서비스 실행
3. 알림 서비스는 실행하지 않음
4. publisher 실행
5. 이후 알림 서비스를 다시 실행

확인할 것:

```text
꺼져 있던 알림 서비스가 이전 주문 이벤트를 나중에 받을 수 있는가?
```

---

### 실험 3. subscriber를 다시 켠 뒤 새 주문 발행

1. subscriber 3개를 모두 실행
2. publisher를 다시 실행

확인할 것:

```text
다시 켠 subscriber는 새로 발행된 메시지는 받을 수 있는가?
```

---

## 7. 제출 내용

아래 내용을 제출한다.

```text
1. 완성한 코드 파일

2. 실행 화면 캡처
   - subscriber 3개가 모두 메시지를 받은 화면
   - subscriber 하나를 꺼놓고 publish한 화면
   - subscriber를 다시 켠 뒤 새 메시지를 받은 화면

3. 보고서
   - REPORT_TEMPLATE.md의 질문에 답변
```

---

## 8. 보고서에서 꼭 다뤄야 할 핵심

이번 과제에서 중요한 것은 코드 양이 아니다.  
Redis Pub/Sub의 특징을 실험으로 확인하는 것이 중요하다.

특히 아래 내용을 반드시 설명해야 한다.

```text
1. 같은 channel을 구독한 subscriber들이 모두 메시지를 받는 이유

2. subscriber가 꺼져 있을 때 발행된 메시지를 나중에 받지 못하는 이유

3. Redis Pub/Sub이 메시지를 저장하는 구조가 아니라는 점

4. orders channel 하나만 사용하는 방식의 장점과 단점

5. 재고 서비스가 처리에 실패했을 때 Pub/Sub만으로 부족한 이유
```

---

## 9. 오류 해결

### Docker가 실행되지 않는 경우

오류 예시:

```text
Cannot connect to the Docker daemon
```

해결:

```text
Docker Desktop을 실행한 뒤 다시 시도한다.
```

---

### container 이름이 이미 사용 중인 경우

오류 예시:

```text
Conflict. The container name "/redis-pubsub" is already in use
```

해결:

```bash
docker start redis-pubsub
```

그래도 안 되면 기존 container를 삭제하고 다시 만든다.

```bash
docker rm -f redis-pubsub
docker run --name redis-pubsub -p 6379:6379 -d redis:latest
```

---

### Redis 연결이 안 되는 경우

확인할 것:

```bash
docker ps
```

`redis-pubsub` container가 실행 중인지 확인한다.

---

## 10. 심화 생각거리

필수 구현은 `orders` channel 하나만 사용하지만, 아래 구조도 생각해보자.

```text
orders
orders:electronics
orders:food
orders:book
```

channel을 하나로 쓰는 방식과 여러 개로 나누는 방식은 어떤 차이가 있을까?
