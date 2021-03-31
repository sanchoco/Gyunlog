// index.js
$(document).ready(function () {
	$('#contents').empty();
	whoru();
	show_list();
	if (checkLogin()) {
		$('#before_login_btn').addClass('d-none');
		$('#after_login_btn').removeClass('d-none');
	} else {
		$('#before_login_btn').removeClass('d-none');
		$('#after_login_btn').addClass('d-none');
	}
});
function show_list() {
	$.ajax({
		type: 'get',
		url: `/list`,
		success: function (response) {
			let temp_html = '';
			for (info of response) {
				temp_html += `
				<div class="card mt-3">
					<div class="card-body">
						<h5 class="card-title">${info['title']}</h5>
						<p class="card-text">${info['nickname']} | ${info['date']}</p>
						<a href="/${info['postId']}" class="btn btn-primary">자세히 보기</a>
					</div>
				</div>
				`;
			}
			$('#contents').append(temp_html);
		}
	});
}

function whoru() {
	if (localStorage.token) {
		$.ajax({
			type: 'get',
			url: `/user`,
			headers: {
				token: localStorage.getItem('token')
			},
			success: function (response) {
				let nickname = response.nickname;
				console.log(response);
				$('#whoru').text(`${nickname}님, 안녕하세요!`);
			},
			error: function (xhr, status, err) {
				logout();
			}
		});
	}
}
