import Login from "./modules/login.module.js";

const loginBTN = document.getElementById("login_btn");

loginBTN.addEventListener("click", async () => {
    const id = document.getElementById("username").value;
    const pw = document.getElementById("password").value;

    const login = new Login(id, pw);
    const result = await login.send();

    if (result.status == 200) {
        location.href = "/";
    } else {
        alert("failed");
    }
});