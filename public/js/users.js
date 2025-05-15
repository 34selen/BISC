import User from "./modules/users.module.js";

const user = new User();
const result = await user.get();

const userContainer = document.getElementById("append-user");
const userSearchBtn = document.getElementById("search-btn");

userSearchBtn.addEventListener("click", async () => {
    const value = document.getElementById("search-text").value;
    const search_result = await user.search(value);

    if (search_result.isSearched) {
        const users = search_result.list;

        userContainer.innerHTML = "";

        for (let i = 0; i < users.length; i++) {
            const user = users[i];

            userContainer.innerHTML += `
            <tr>
                <th scope="row">${i + 1}</th>
                <td>${user.user_id}</td>
                <td>${user.email}</td>
                <td>@${user.role}</td>
            </tr>
            `;
        }
    } else {
        userContainer.innerHTML = "";
    }
});

if (result.isUserList) {
    const users = result.list;

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        userContainer.innerHTML += `
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${user.user_id}</td>
            <td>${user.email}</td>
            <td>@${user.role}</td>
        </tr>
        `;
    }
}