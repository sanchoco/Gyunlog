// write.js
function posting() {
	let title = $("#title").val()
	let writer = $("#writer").val()
	let password = $("#password").val()
	let content = $("#content").val()

	$.ajax({
		type: "POST",
		url: `/api/write`,
		data: {
			"title": title,
			"writer": writer,
			"password": password,
			"content": content
		},
		success: function (response) {
			if (response.msg == "success") {
				alert("등록 완료!")
				window.location.href = "/";
			} else {
				alert("빈 곳을 확인 해주세요!")
			}
		}
	});
}
