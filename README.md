# Gyunlog

>게시글을 남겨보세요!


### 주요기능
- **글 목록 및 상세 내용**: 누구나 글 목록을 확인하고 클릭하여 상세 내용을 확인할 수 있어요.
- **회원가입**: 아이디, 비밀번호, 닉네임을 확인하고 회원가입을 진행할 수 있습니다.
- **로그인, 로그아웃**: 아이디, 패스워드를 입력하여 로그인 할 수 있고 로그아웃 버튼을 눌러 나올 수 있어요.
- **글 작성, 수정, 삭제**: 로그인한 사용자는 글을 작성하여 게시할 수 있고 자신의 글만 수정 및 삭제가 가능해요.
- **댓글 작성, 수정, 삭제**: 로그인한 사용자는 댓글을 달 수 있고 자신의 댓글만 수정 및 삭제가 가능해요.


### 사용한 것
Javascript, Node.js, express, mongoDB, jwt, jQuery


### 기능(API 목록)
|             |     기능     | Method |        URL         |                 request                 |                           response                           |
| :---------: | :----------: | :----: | :-------------: | :----------------------------: | :-----------------------------: |
| 메인 페이지 |  화면 표시   |  GET   |         /          |                                         |                          index.html              |
|             |  글 리스트   |  GET   |       /list        |                                         |             { postId, title, nickname, date }...    |
|             |  접속 정보   |  GET   |       /user        |                                         |                           nickname                |
|   로그인    | 사용자 접속  |  POST  |       /login       |            { id, password }             |                 success \|\| empty \|\| fail       |
|  회원가입   |  등록 요청   |  POST  |     /register      | { id, password, password_re, nickname } | success \|\| empty \|\| wrong_id \|\| wrong_nickname \|\| wrong_password \|\| already_id \|\| already_nickname \|\| iff_password |
| 상세 페이지 |  화면 표시   |  GET   |      /:postId      |                                         |                         detail.html                  |
|             | 글 상세 정보 |  GET   |   /list/:postId    |                                         |               {title, nickname, content, date}     |
|             |   글 수정    |  PUT   |   /list/:postId    |           { title, content  }           |                 success \|\| empty \|\| fail            |
|             |   글 삭제    | DELETE |   /list/:postId    |                                         |                      success \|\| fail              |
|             |  댓글 목록   |  GET   |  /comment/:postId  |                                         |                 {nickname, comment, date}...           |
|             |  댓글 작성   |  POST  |  /comment/:postId  |               { comment }               |                 success \|\| empty \|\| fail           |
|             |  댓글 수정   |  PUT   | comment/:commentId |         { commentId, comment }          |                 success \|\| empty \|\| fail         |
|             |  댓글 삭제   | DELETE | comment/:commentId |                                         |                      success \|\| fail               |



### 기타
- XSS 공격 방지: sanitize-html 모듈을 사용하여 JS코드 차단
- 패스워드 암호화: bcrypt 모듈을 사용하여 salt된 해시 알고리즘 비밀번호를 저장

