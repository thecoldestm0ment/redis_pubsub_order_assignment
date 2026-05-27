# Instructor Notes

- 학생이 구현해야 하는 파일은 `src/` 아래에 있다.
- 참고 정답 코드는 `.instructor/solutions/` 아래에 분리해 두었다.
- 학생에게 배포할 때는 `.instructor/` 폴더를 제외하는 편이 안전하다.

## 참고 실행 명령

```bash
npm run test:redis
npm run check:assignment
node .instructor/solutions/subscribers/inventory-subscriber.js
node .instructor/solutions/subscribers/delivery-subscriber.js
node .instructor/solutions/subscribers/notification-subscriber.js
node .instructor/solutions/order-publisher.js
```
