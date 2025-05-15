import auth from "./modules/auth_check.module.js";

const result = await auth.checkAuth();

console.log(result.isLogin);