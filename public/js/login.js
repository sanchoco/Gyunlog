// login.js
$(document).ready(function () {
	if (localStorage.getItem('token')) {
		alert('이미 로그인되어 있습니다. 메인 페이지로 이동합니다.');
		window.location.href = '/';
	}
});

function login() {
	let id = $('#id').val();
	let password = $('#password').val();

	$.ajax({
		type: 'POST',
		url: `/login`,
		data: {
			id: id,
			password: password
		},
		success: function (response) {
			if (response.msg == 'success') {
				localStorage.setItem('token', response.token);
				alert('로그인 성공!');
				window.location.href = '/';
			} else if (response.msg == 'empty') {
				alert('빈 곳을 확인 해주세요.');
			} else if (response.msg == 'fail') {
				alert('아이디 또는 패스워드가 일치하지 않습니다.');
			} else {
				alert('에러! 다시 시도해주세요.');
			}
		}
	});
}
