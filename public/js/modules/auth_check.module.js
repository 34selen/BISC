const nav_content = document.getElementById("navbar-text");

async function checkAuth() {
    return await $.ajax({
        url: '/auth/check',
        type: 'POST',
    });
}

if (nav_content) {
    const result = await checkAuth();

    if (result.isLogin) {
        nav_content.innerHTML = `
            <user style="font-weight: 800;">${result.user.username} - ${result.user.role == "general" ? "직원" : "팀"}</user>
        `
    } else {
        nav_content.innerHTML = `
            <a href="/auth/login" style="text-decoration: none;"><button type="button" class="btn btn-outline-primary">시스템 로그인</button></a>
            <a href="/auth/signup" style="text-decoration: none;"><button type="button" class="btn btn-outline-primary">시스템 회원가입</button></a>
        `
    }
}

export default {
    checkAuth
}