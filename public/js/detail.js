// detail.js

$(document).ready(function() {
	show_data()
})
function show_data(){
	$.ajax({
		type: "get",
		url: `/list${window.location.pathname}`,
		success: function (response) {
			$("#title").text(response["title"])
			$("#writer").text(response["writer"])
			$("#content").text(response["content"])
			$("#date").text(response["date"])
			$("#update_btn").attr('onclick', `window.location.href='/${response["postId"]}/update'`)
			$("#delete_btn").attr("onclick", `delete_data(${response["postId"]})`)
		}
	});
}

function delete_data(postId) {
	$.ajax({
		type: "DELETE",
		url: `list/${postId}`,
		data: {
			postId: postId
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
