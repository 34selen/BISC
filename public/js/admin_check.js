import AdminCheck from "./modules/admin_check.module.js";

const adminVerifyBtn = document.getElementById("admin_verify_btn");

adminVerifyBtn.addEventListener("click", async () => {
    let admin_key = "";

    for (let i = 0; i < 12; i++) {
        const value = document.getElementById(`admin_key${i + 1}`).value;

        if ((i + 1) % 3 == 0 && i != 11) admin_key += value + "-";
        else admin_key += value;
    }

    const adminCheck = new AdminCheck();
    const result = await adminCheck.send(admin_key);

    if (result.isCheck) {
        const key = result.key;

        history.pushState({}, "", "/admin?admin_key=" + key);
        location.reload();
    } else {
        alert("failed");
    }
});