# 시아아빠의 AI작업실

플랫폼 · 웹툰 · 영상 · 음악 모음: https://tkooya-09.github.io/

## 작품 관리

`assets/app/site.js`의 `ITEMS` 배열에서 작품을 추가·수정합니다. 공개 저장소 자동 수집은 사용하지 않습니다. 음악 파일은 `assets/music/`에 두고 `audio`, `lyrics` 항목을 등록합니다. 공개 가능한 자료만 커밋하세요. 비공개 표시나 화면 숨김만으로 GitHub의 공개 파일을 보호할 수는 없습니다.

## 관리자 로그인

https://tkooya-09.github.io/admin.html

지정한 관리자 비밀번호만 입력해 로그인합니다. 이메일 가입이나 별도 최초 연결은 필요하지 않습니다. 비밀번호는 서버의 비공개 영역에 bcrypt 해시로 보관하며, 공개 코드에는 포함하지 않습니다.

방명록·챌린지 게시글의 숨김·복원과 챌린지 글 수정은 로그인한 관리자만 가능합니다. 기존 작성자 비밀번호를 이용한 수정·삭제와 이전 계정 연결 경로는 차단했습니다. 공개 작품·음악은 로그인 없이 볼 수 있고, 방명록 새 글 작성은 기존과 같이 가능합니다. 음악·작품 파일 편집은 저장소 권한으로 보호됩니다.

로그인 인증값은 이 탭의 메모리에만 유지합니다. 서버가 10분 미사용·30분 절대 만료를 검사하며, 로그아웃 시 인증값을 폐기합니다. 비밀번호 입력은 전체 기준 분당 5회·시간당 30회로 제한합니다.

## 검증

```sh
node --test tests/security/*.test.mjs
```

`tests/security/admin-auth.sql`은 관리자 DB 변경과 함께 트랜잭션 안에서 실행하고 반드시 롤백하는 검증용입니다. 운영 계정을 만들지 않습니다. GitHub Actions의 `Security checks`가 프런트엔드·방명록 검사를 수행합니다.

변경 이력과 제한 사항은 `supabase/SECURITY.md`를 참고하세요.

## Visitor and work popularity counts

The homepage defaults to `조회수순`. Work views count service-link opens and successful audio playback, once per browser/work/day in Asia/Seoul. Repository-link clicks are excluded. Ties keep the curated order, and failed metric requests leave the catalog usable with unavailable counts rather than invented zeroes. These are this studio’s interactions, not Naver or YouTube view totals.

`studio_visitors.work_totals` holds registered work IDs and aggregates. To add a new tracked work, register its ID in that table as well as in `ITEMS`. `work_daily_views` stores temporary daily deduplication tokens; browser roles cannot access these tables or call the counting RPC directly. Existing daily visitor totals remain intact. The Edge Function accepts only bounded work IDs and obtains its rate-limit subject server-side.

Verification: `node --test tests/security/*.test.mjs`; run `tests/security/work-views.sql` as an administrator for transactional, rolled-back counting checks.
