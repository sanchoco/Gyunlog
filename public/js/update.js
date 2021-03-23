// update.js
$(document).ready(function () {
	get_data()
})

function get_data() {
	$.ajax({
		type: "get",
		url: `/api` + window.location.pathname,
		success: function (response) {
			$("#title").attr("value", response["title"])
			$("#writer").attr("value", response["writer"])
			$("#content").text(response["content"])
			$("#update_btn").attr("onclick", `update_data(${response["postId"]})`)
			$("#delete_btn").attr("onclick", `delete_data(${response["postId"]})`)

		}
	});
}

function update_data(postId) {
	let title = $("#title").val()
	let writer = $("#writer").val()
	let password = $("#password").val()
	let content = $("#content").val()

	$.ajax({
		type: "PUT",
		url: `/api/update/` + postId,
		data: {
			"title": title,
			"writer": writer,
			"password": password,
			"content": content
		},
		success: function (response) {
			if (response.msg == "success") {
				alert("수정 완료!")
				window.location.href = "/";
			} else if (response.msg == "empty") {
				alert("빈 칸을 확인하세요.")
			} else {
				alert("비밀번호를 확인해주세요.")
			}
		}
	});
}

function delete_data(postId) {
	let password = $("#password").val()
	$.ajax({
		type: "DELETE",
		url: `/api/delete/` + postId,
		data: {
			"password": password,
		},
		success: function (response) {
			if (response.msg == "success") {
				alert("삭제 완료!")
				window.location.href = "/";
			} else {
				alert("비밀번호를 확인해주세요!")
			}
		}
	});
}
