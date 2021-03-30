// detail.js

$(document).ready(function() {
	show_data()
	show_comment()

	if (!localStorage.getItem('token')) {
		$("#comment_form").addClass('d-none');
	}
})
function show_data(){
	$.ajax({
		type: "get",
		url: `/list${window.location.pathname}`,
		headers: {
			token: localStorage.getItem('token')
		},
		success: function (response) {
			$("#title").text(response["title"])
			$("#nickname").text(response["nickname"])
			$("#content").text(response["content"])
			$("#date").text(response["date"])
			$("#update_btn").attr('onclick', `window.location.href='/${response["postId"]}/update'`)
			$("#delete_btn").attr("onclick", `delete_data(${response["postId"]})`)
			$("#comment_btn").attr("onclick", `comment_add(${response["postId"]})`)
			if (!response.permission) {
				$("#update_btn").addClass('d-none');
				$("#delete_btn").addClass('d-none');
			}
		}
	});
}

function delete_data(postId) {
	if (confirm("삭제하시겠습니까?") == true) {
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

function show_comment() { // 댓글 목록
	$.ajax({
			type: "get",
		url: `/comment${window.location.pathname}`,
		headers: {
			token: localStorage.getItem('token')
		},
			success: function (response) {
				let temp_html = '';
				for (info of response) {
					let edit = `<td></td><td></td>`
					if (info.permission) {
					edit = `<td id="${info.commentId}_edit" onclick="edit_comment(${info.commentId})" style="cursor:Pointer; width:3rem; text-align:center;">수정</td>
							<td id="${info.commentId}_delete" onclick="delete_comment(${info.commentId})" style="cursor:Pointer; width:3rem;  text-align:center;">삭제</td>`
					}
					temp_html += `
					<tr>
						<td id="co_nickname" style="width:fit-content;">${info.nickname}</td>
						<td id="${info.commentId}_text">${info.comment}</td>
						<td id="co_date" style="max-width:7rem; text-align:center;">${info.date}</td>
						${edit}
					</tr>`
				}
				$("#comment_table").append(temp_html)
				if (response.length == 0) {
					$("#comment_wrap").addClass('d-none');
				}
			}

		});

}


function edit_comment(commentId) { // 수정 버튼 클릭
	text = $(`#${commentId}_text`).text()
	$(`#${commentId}_text`).text("")
	$(`#${commentId}_text`).append(`
		<input class="form-control" id="editing_${commentId}" type="text" value="${text}" style="width:90%; ">
		`)

	$(`#${commentId}_edit`).text("확인")
	$(`#${commentId}_edit`).attr("onclick", `edit_comment_submit(${commentId})`)

	$(`#${commentId}_delete`).text("취소")
	$(`#${commentId}_delete`).attr("onclick", `edit_comment_cancel(${commentId}, "${text}")`)
	return
}

function delete_comment(commentId) { // 삭제 버튼 클릭
	if (confirm("삭제하시겠습니까?") == true) {
		$.ajax({
			type: "DELETE",
			url: `comment/${commentId}`,
			headers: {
				token: localStorage.getItem('token')
			},
			data: {
				commentId: commentId
			},
			success: function (response) {
				if (response.msg == "success") {
					alert("삭제 완료!")
					window.location.reload();
				} else {
					alert("작성자만 삭제할 수 있습니다.")
				}
			},
			error: function (xhr, textStatus, error) {
				alert(xhr.responseJSON.message);
			}
		});
	}
}

function edit_comment_submit(commentId) { // 댓글 수정 요청
	text = $(`#editing_${commentId}`).val()
	$.ajax({
		type: "PUT",
		url: `comment/${commentId}`,
		headers: {
			token: localStorage.getItem('token')
		},
		data: {
			commentId: commentId,
			comment: text
		},
		success: function (response) {
			if (response.msg == "success") {
				alert("수정 완료!")
				window.location.reload();
			} else if (response.msg == "empty") {
				alert("수정할 댓글을 입력하세요.")
			} else {
				alert("작성자만 삭제할 수 있습니다.")
			}
		},
		error: function (xhr, textStatus, error) {
			alert(xhr.responseJSON.message);
		}
	});
}

function edit_comment_cancel(commentId, text) { // 되돌리기
	$(`#${commentId}_text`).text(text);

	$(`#${commentId}_edit`).text("수정")
	$(`#${commentId}_edit`).attr("onclick", `edit_comment(${commentId})`)

	$(`#${commentId}_delete`).text("삭제")
	$(`#${commentId}_delete`).attr("onclick", `delete_comment(${commentId})`)
}


