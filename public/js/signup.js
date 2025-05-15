import Signup from "./modules/signup.module.js";

const signupBTN = document.getElementById("signup_btn");

signupBTN.addEventListener("click", async () => {
    const id = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const pw = document.getElementById("password").value;
    const repw = document.getElementById("repassword").value;

    const signup = new Signup(id, email, pw, repw);
    const result = await signup.send();

    if (result.status == 200) {
        location.href = "/auth/login";
    } else {
        alert("failed");
    }
});