// detail.js

$(document).ready(function() {
	show_data()
})
function show_data(){
	$.ajax({
		type: "get",
		url: `/api` + window.location.pathname,
		success: function (response) {
			$("#title").text(response["title"])
			$("#writer").text(response["writer"])
			$("#content").text(response["content"])
			$("#date").text(response["date"])
			$("#update_btn").attr('onclick', `window.location.href='/update/${response["postId"]}'`)
			$("#delete_btn").attr("onclick", `delete_data(${response["postId"]})`)
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
				alert("작성자만 삭제할 수 있습니다.")
			}
		}
	});
}
