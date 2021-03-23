// index.js
$(document).ready(function () {
	$("#contents").empty();
	show_list();
})
function show_list() {
	$.ajax({
		type: "get",
		url: `/api/list`,
		success: function (response) {
			let temp_html = ''
			for (info of response) {
				temp_html +=
				`
				<div class="card w-100">
					<div class="card-body">
						<h5 class="card-title">${info["title"]}</h5>
						<p class="card-text">${info["writer"]} | ${info["date"]}</p>
						<a href="/detail/${info["postId"]}" class="btn btn-primary">자세히 보기</a>
					</div>
				</div>
				`
			}
			$("#contents").append(temp_html)
		}
	});
}
