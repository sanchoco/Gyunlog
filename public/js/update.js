// update.js
$(document).ready(function () {
	if (!localStorage.getItem('token')) {
		alert('로그인한 사용자만 수정할 수 있습니다.');
		window.history.back();
	} else {
		get_data();
	}
});

function get_data() {
	$.ajax({
		type: 'get',
		url: '/list/' + window.location.pathname.split('/')[1],
		success: function (response) {
			$('#title').attr('value', response['title']);
			$('#content').text(response['content']);
			$('#update_btn').attr('onclick', `update_data(${response['postId']})`);
		}
	});
}

function update_data(postId) {
	let title = $('#title').val();
	let content = $('#content').val();

	$.ajax({
		type: 'PUT',
		url: `/list/` + postId + '/update',
		headers: {
			token: localStorage.getItem('token')
		},
		data: {
			title: title,
			content: content
		},
		success: function (response) {
			if (response.msg == 'success') {
				alert('수정 완료!');
				window.location.href = '/';
			} else if (response.msg == 'empty') {
				alert('빈 칸을 확인하세요.');
			} else {
				alert('작성자만 수정할 수 있습니다.');
			}
		},
		error: function (xhr, textStatus, error) {
			alert('잘못된 접근입니다.');
			window.history.back();
		}
	});
}
