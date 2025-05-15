import Admin from "./modules/admin.module.js";

const fileDownloadBtn = document.getElementById("file_download_btn");

fileDownloadBtn.addEventListener("click", async () => {
    const file_name = document.getElementById("file_name").value;

    const admin = new Admin();
    const result = await admin.send(file_name);

    if (result.isFile != false) {
        const aTag = document.createElement("a");
        const admin_key = location.search.split("=")[1];

        aTag.style.display = "none";
        aTag.href = `/admin/download?admin_key=${admin_key}&filename=${file_name}`;
        aTag.download = file_name;
        
        document.body.appendChild(aTag);
        aTag.click();
        window.URL.revokeObjectURL(`/admin/download?admin_key=${admin_key}&filename=${file_name}`);

        document.getElementById("file_name").value = "";
        document.getElementById("file_name").innerText = "";
    } else {
        alert("failed");

        document.getElementById("file_name").value = "";
        document.getElementById("file_name").innerText = "";
    }
});