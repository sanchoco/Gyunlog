// update.js
$(document).ready(function () {
	get_data()
})

function get_data() {
	$.ajax({
		type: "get",
		url: "/list/" + window.location.pathname.split("/")[1],
		success: function (response) {
			$("#title").attr("value", response["title"])
			$("#content").text(response["content"])
			$("#update_btn").attr("onclick", `update_data(${response["postId"]})`)

		}
	});
}

function update_data(postId) {
	let title = $("#title").val()
	let content = $("#content").val()

	$.ajax({
		type: "PUT",
		url: `/list/` + postId + '/update',
		data: {
			"title": title,
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

