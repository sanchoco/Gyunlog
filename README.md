# Gyunlog

익명으로 게시글을 남겨보세요! 

<img src="https://user-images.githubusercontent.com/58046372/112098879-ddce7980-8be5-11eb-9e2c-9ae34d813e63.jpg" height="390px">

### 주요기능
- 여러 사람이 올린 게시글을 확인할 수 있어요.
- 최근 작성 순으로 목록이 보여집니다.
- 게시글을 작성할 수 있어요.
- 비밀번호를 입력하여 수정 또는 삭제를 할 수 있어요.

### 사용 기술
Node.js, express, mongoDB, jQuery, Bootstrap


### 기능(API 목록)

| 기능 | Method    | URL | request | response |
| :-       | -    | :-: | -:      | -:       |
| 메인페이지  | GET | / |  | 메인 페이지 |
|          | GET | /api/list |  | 게시글 목록(제목, 작성자, 작성일) |
| 글쓰기     | GET | /post | | 게시글 작성 페이지 |
|          | POST | /api/post | {title, write, password, content} | 게시글 작성 처리 후 성공 여부 |
| 상세 페이지 | GET | /detail/:id |  | 게시글 상세 페이지 |
|          | GET | /api/detail/:id |  | 해당 글 데이터(제목, 작성자, 작성일, 내용) |
| 수정 페이지 | GET | /update/:id |  | 게시글 수정 페이지 |
|          | GET | /api/update/:id |  | 수정을 위한 글 정보(제목, 작성자, 내용) |
|          | PUT | /api/update/:id | { password } | 패스워드 확인 후 수정 |
|          | DELETE | /api/delete/:id | { password } | 패스워드 확인 후 삭제 |

### 기타
- XSS 공격 방지: sanitize-html 모듈을 사용하여 JS코드 차단   
- 패스워드 암호화: bcrypt 모듈을 사용하여 salt된 해시 알고리즘 비밀번호를 저장

