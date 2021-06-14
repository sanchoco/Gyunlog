# Gyunlog
>로그인하여 글을 남겨보세요! 😀   



## 구현 화면
![ezgif-3-fcb76ddd2d2e](https://user-images.githubusercontent.com/58046372/113247144-5bd10580-92f5-11eb-93e2-26127610c366.gif)

## 사용한 것
Javascript, Node.js, mongoDB, JWT
   
   
## 주요 기능
- **메인 페이지(글 목록)**: 누구나 글 목록을 확인하고 클릭하여 상세 내용을 확인할 수 있어요.
- **회원가입**: 아이디, 비밀번호, 닉네임을 확인하고 회원가입을 진행할 수 있습니다.
- **로그인, 로그아웃**: 아이디, 패스워드를 입력하여 로그인 할 수 있고 로그아웃 버튼을 눌러 나올 수 있어요.
- **글 작성, 수정, 삭제**: 로그인한 사용자는 글을 작성하여 게시할 수 있고 자신의 글만 수정 및 삭제가 가능해요.
- **댓글 작성, 수정, 삭제**: 로그인한 사용자는 댓글을 달 수 있고 자신의 댓글만 수정 및 삭제가 가능해요.



## 페이지별 기능 상세 설명

<details>
    <summary>메인 페이지</summary>

- 로그인 여부에 따라 로그인 버튼 혹은 글쓰기 버튼이 보이게 되며 접속 중인 사용자 닉네임을 표시합니다.
- 글 목록은 최신순으로 표시되며 제목, 작성자, 작성 일자를 표시합니다.
- 자세히 보기 버튼을 누르면 해당 글의 상세 페이지로 이동합니다.

</details>

<details>
    <summary>로그인 페이지</summary>

- 사용자는 아이디와 패스워드를 입력하여 로그인을 요청합니다.
- 서버는 DB와 해당 사용자가 존재한다면 토큰을 발급하고 로그인 요청을 승인합니다.
- 로그인 성공 시 메인페이지로 이동합니다.
- 만약 강제로 로그인한 사용자가 로그인 페이지에 접속한다면 메인 페이지로 돌려보냅니다.
```javascript
user = await User.findOne({ id }).exec();

if (user) {
   await bcrypt.compare(password, user.password, (err, same) => {
      // 암호화된 비밀번호와 일치 여부
      if (same) {
         // 비밀번호가 정상적으로 입력된 경우
         const key = require('../secret_key'); // 시크릿키 가져오기
         const token = jwt.sign({ userId: user._id }, key); // _id로 고유 토큰 생성
         res.json({ msg: 'success', token });
      } else {
         res.json({ msg: 'fail' });
      }
   });
} else {
   res.json({ msg: 'fail' });
}
```
</details>


<details>
    <summary>회원가입</summary>

- 아이디는 3자 이상 영문 ,숫자, _ 만 사용 가능하고 패스워드는 아이디가 포함되지 않는 4자 이상 사용할 수 있어요.
- 닉네임은 공백을 제외한 2자~10자 사용할 수 있어요.
- 가입하기 버튼을 눌러 서버에 요청을 보내면 기존 사용자의 아이디, 닉네임과 중복되는지 체크합니다.
- 모든 조건을 충족한다면 가입정보와 패스워드(bcrypt 모듈을 활용하여 salt 해시 알고리즘으로 암호화된 값)를 DB에 저장합니다.
- 회원가입이 성공적이라면 로그인 페이지로 이동합니다.
- 만약 로그인한 사용자가 강제로 페이지에 접속한다면 메인 페이지로 돌려보냅니다.

```javascript
await User.create({ // 검증 후 유저 생성
   id: sanitizeHtml(id),
   password: bcrypt.hashSync(password, 10), // 암호화 저장
   nickname: sanitizeHtml(nickname)
});
```
</details>

<details>
    <summary>상세 페이지</summary>
	
- 누구든지 글의 제목, 작성자, 작성일, 댓글을 확인할 수 있습니다.
- 해당 글의 작성자만 수정 및 삭제 버튼이 보이며 해당 기능을 이용할 수 있습니다.
- 댓글 작성은 로그인한 사용자에게만 보이며 댓글을 작성하여 등록할 수 있습니다.
- 댓글은 최신순으로 보이며 자신이 작성한 댓글만 수정 및 삭제를 할 수 있습니다.
- 게시글 삭제 시 댓글들이 모두 지워집니다.

```javascript
router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const post = await Post.findOne({ postId: id }).select('postId title nickname content date');

	let user;
	try {
		const { token } = req.headers;
		const { userId } = jwt.verify(token, key);
		user = await User.findOne({ _id: userId }, { nickname: true });
	} catch (err) {}
	let permission = 0; // 프론트 수정,삭제 버튼을 표시하기 위한 변수
	if (user && user['nickname'] == post['nickname']) permission = 1;

	const data = {
		postId: id,
		title: sanitizeHtml(post['title']),
		nickname: sanitizeHtml(post['nickname']),
		content: sanitizeHtml(post['content']),
		date: moment(post['date']).format('MM/DD HH:mm:ss'),
		permission: permission
	};
	res.json(data);
});
```
</details>

<details>
    <summary>글쓰기</summary>
	
- 로그인한 사용자만 해당 기능을 이용할 수 있습니다.
- 제목과 내용을 작성하여 글쓰기 버튼을 누르면 게시글을 등록할 수 있습니다.
- 만약 로그인하지 않은 사용자가 강제로 페이지에 접속한다면 메인 페이지로 돌려보냅니다.

```javascript
const title = sanitizeHtml(data['title']);
const content = sanitizeHtml(data['content']);
if (!(title && content)) {
   res.json({ msg: 'empty' });
   return;
} else {
   const lasted = await Post.findOne().sort({ postId: -1 });
   let index = 1;
   if (lasted) {
      index = lasted['postId'] + 1;
   }
   await Post.create({
      postId: index,
      title: title,
      nickname: user.nickname,
      content: content,
      date: Date.now()
   });
   res.json({ msg: 'success' });
}
```

</details>

<details>
    <summary>공통 기능</summary>
	
- 로그인이 필요한 기능은 모두 토큰을 확인하여 정상적인 사용자인지 체크합니다. (미들웨어)
- 외부로 보이는 모든 정보는 XSS 공격을 대비해 sanitize-html 모듈을 활용하여 데이터를 저장하고 보여줍니다.

```javascript
module.exports = (req, res, next) => { // 접속 인증 미들웨어
	const { token } = req.headers;
	if (!token) {
		res.status(401).send({ message: '로그인 후 이용할 수 있습니다.' });
		return
	}
	try {
		jwt.verify(token, key); // 토큰 검증
		next();
	} catch (err) {
		res.status(401).send({ message: '로그인 후 이용할 수 있습니다.' }); //접근 제한
		return
	}
}
```
</details>

## API 목록
<details>
    <summary>자세히</summary>

|      |  기능  | Method |URL|request|response|
| :- | :- | :- | :- | :- | :- |
| 메인 페이지 |  화면 표시   |  GET|/||index.html|
| |글 리스트| GET | /list | |{ postId, title, nickname, date }...|
| |접속 정보|GET|/user| |nickname|
|로그인|화면 표시|GET|/login| |login.html|
| |사용자 접속|POST|/login|{ id, password }|success \|\| empty \|\| fail|
|회원가입|화면 표시|GET|/register||register.html|
| |등록 요청|POST|/register|{ id, password, password_re, nickname }|success \|\| empty \|\| wrong_id \|\| wrong_nickname \|\| wrong_password \|\| already_id \|\| already_nickname \|\| diff_password |
| 글 작성 페이지 | 화면 표시 | GET | /new | | new.html |
| | 글 작성 | POST | /new | { title, content} | success \|\| empty \|\| fail |
|  상세 페이지 |  화면 표시   | GET | /:postId | | detail.html |
| | 글 상세 정보 | GET | /list/:postId | |    {title, nickname, content, date}  |
| | 글 수정 | PUT | /list/:postId | { title, content  } | success \|\| empty \|\| fail |
| | 글 삭제 | DELETE |   /list/:postId | | success \|\| fail |
| | 댓글 목록 |  GET |  /comment/:postId  | | {nickname, comment, date}... |
| | 댓글 작성 |  POST |  /comment/:postId  | { comment } | success \|\| empty \|\| fail |
| | 댓글 수정 |  PUT | comment/:commentId | { commentId, comment } | success \|\| empty \|\| fail |
| | 댓글 삭제 | DELETE | comment/:commentId | | success \|\| fail |

</details>

## 후기
프론트엔드와 백엔드를 완전히 구분하기 위해 템플릿 엔진을 사용하지 않고 CSR방식의 사이트를 구상하고 프로젝트를 시작하였습니다.   
백엔드에 집중하기 위해 프론트는 부트스트랩 템플릿을 사용하고 AJAX를 활용해 통신하는 방식으로 만들었고 API를 만드는 부분에 있어서 REST하게 만들어 의미있고 간결하게 만드려 노력했습니다.

API를 설계할 때 메인페이지에서 글 리스트를 가져오는 API를 '\/', GET 요청을 하게 되면 html을 불러오는 URI와 겹치기 때문에 /list를 만들게 되고 자연스럽게 상세페이지는 '/:id'와 '/list/:id'로 만들게 되어서 REST가 맞을까 고민했습니다. 메소드 요청은 알맞게 한 부분도 있지만 회원가입을 /user 대신 /register로 하는 등 URI를 만드는 부분에서 미흡한 점이 많다고 느껴졌고 스스로 깨닫고 더 공부하는 계기가 되었습니다.
   
미들웨어를 직접 만들어 사용해보고 여러 에러를 겪으면서 확실하게 이해할 수 있었습니다. 라우터 레벨에서 미들웨어를 직접 붙였던 적이 있었는데 response가 원하는대로 되지 않았고 로그를 찍어 원인을 찾는데 애를 먹었습니다. 라우터 레벨에 미들웨어를 사용했을 때 하위 레벨에 들어가기 전 URI가 응답해버리는 바람에 정상 작동되지 않는 것을 알 수 있었고, 요청을 받는 부분에 미들웨어를 붙여 처리하도록 하여 해결할 수 있었습니다.

이전에 파이썬 플라스크로 JWT 인증을 구현해본 적 있었고 이번 프로젝트에서 로그인 구현하면서 도움되었습니다. JWT에 대해 확실히 이해하며 내 것이 만드는 시간이였습니다. 그리고 사용자가 작성한 글이나 댓글에서만 수정, 삭제 버튼이 보이게 할지 고민하였는데, 서버에서 접속한 사용자와 매칭해서 권한에 대한 정보를 보내주고 서비스를 요청할 때 권한을 다시 한번 확인하도록 했습니다.  

가장 기본적인 CRUD와 로그인 인증을 구현한 프로젝트이라 단순하지만 기초를 확실하게 다지는 프로젝트였습니다.


