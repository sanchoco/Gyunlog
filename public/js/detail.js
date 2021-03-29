// detail.js

$(document).ready(function() {
	show_data()
	show_comment()
})
function show_data(){
	$.ajax({
		type: "get",
		url: `/list${window.location.pathname}`,
		success: function (response) {
			$("#title").text(response["title"])
			$("#nickname").text(response["nickname"])
			$("#content").text(response["content"])
			$("#date").text(response["date"])
			$("#update_btn").attr('onclick', `window.location.href='/${response["postId"]}/update'`)
			$("#delete_btn").attr("onclick", `delete_data(${response["postId"]})`)
			$("#comment_btn").attr("onclick", `comment_add(${response["postId"]})`)
		}
	});
}

function delete_data(postId) {
	$.ajax({
		type: "DELETE",
		url: `list/${postId}`,
		headers: {
			token: localStorage.getItem('token')
		},
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
		},
		error: function (xhr, textStatus, error) {
			alert(xhr.responseJSON.message);
		}
	});
}

function comment_add(postId) {
	comment = $("#comment").val()
	$.ajax({
		type: "POST",
		url: `comment/${postId}`,
		headers: {
			token: localStorage.getItem('token')
		},
		data: {
			comment : comment
		},
		success: function (response) {
			if (response.msg == "success") {
				alert("댓글 등록 완료!")
				window.location.reload();
			} else if (response.msg == "empty"){
				alert("댓글을 입력하세요.");
			} else {
				alert("등록 에러");
			}
		},
		error: function (xhr, textStatus, error) {
			alert(xhr.responseJSON.message);
		}
	});
}

function show_comment() {
	$.ajax({
			type: "get",
			url: `/comment${window.location.pathname}`,
			success: function (response) {
				let temp_html = '';
				for (info of response) {
					temp_html += `
					<tr>
						<td>${info.nickname}</td>
						<td>${info.comment}</td>
						<td style="text-align:right;">${info.date}</td>
					</tr>`
				}
				$("#comment_table").append(temp_html)
			}
		});

}
