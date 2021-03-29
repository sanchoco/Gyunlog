// new.js
// index.js
$(document).ready(function () {
	if (!localStorage.getItem('token')){
		alert('로그인이 필요한 기능입니다.');
		window.location.href = "/";
	}
})

function posting() {
	let title = $("#title").val()
	let content = $("#content").val()

	$.ajax({
		type: "POST",
		url: `/new`,
		headers: {
			token: localStorage.getItem('token')
		},
		data: {
			"title": title,
			"content": content
		},
		success: function (response) {
			console.log(response)
			if (response.msg == "success") {
				alert("등록 완료!")
				window.location.href = "/";
			} else {
				alert("빈 곳을 확인 해주세요.")
			}
		},
		error: function (xhr, textStatus, error) {
			alert(xhr.responseJSON.message);
			window.location.href = "/";
		}
	});
}
