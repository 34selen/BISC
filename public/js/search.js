import Search from "./modules/search.module.js";

const searchBtn = document.getElementById("search-btn");

const init = () => {
    try {
        const messages = document.getElementsByClassName("message");

        for (let key in messages) {
            const message = messages[key];

            message.style.backgroundColor = "";
        }
    } catch {
        console.log("pass");
    }
}

searchBtn.addEventListener("click", async () => {
    const search_text = document.getElementById("search-text").value;

    if (!search_text) return alert("검색 텍스트를 입력해주세요.");

    init();
    
    const search = new Search();
    const result = await search.send(search_text);

    if (result.isSearched) {
        const findedList = result.findedList;

        for (let i = 0; i < findedList.length; i++) {
            const data = findedList[i];
            const element = document.getElementById(String(data.chat_index));

            element.style.backgroundColor = "yellow";
        }
    } else if (result.message == "No Result!") {
        alert("보호된 채팅은 비밀번호 인증 없이는 접근이 불가능합니다.");
    }

    document.getElementById("search-text").value = "";
});