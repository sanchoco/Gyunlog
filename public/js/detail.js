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
			$("#update").attr('onclick', `window.location.href='/update/${response["postId"]}'`)
		}
	});
}
