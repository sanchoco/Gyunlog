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
				temp_html += `
							<tr>
								<td><a href="/detail/${info["postId"]}">${info["title"]}</a></td>
								<td>${info["writer"]}</td>
								<td>${info["date"]}</td>
							</tr>
							`
			}
			$("#contents").append(temp_html)
		}
	});
}
