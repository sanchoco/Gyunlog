$(document).ready(function () {
	checkLogin()
})

function new_post() {
	window.location.href = '/new';
}

function goHome() {
	window.location.href = '/';
}

function goLogin() {
	window.location.href = '/login';
}

function goRegister() {
	window.location.href = '/register';
}

function logout() {
	localStorage.clear();
	goHome();
}

function checkLogin() {
	if (localStorage.token) {
		$("#before_login").addClass('d-none');
		$("#after_login").removeClass('d-none');
		return true;
	} else {
		$("#before_login").removeClass('d-none');
		$("#after_login").addClass('d-none');
		return false;
	}
}
