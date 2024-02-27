// fixtures/index.ts

import { test as base } from "@playwright/test";
import LoginPage from "../pom/login";
import RegisterPage from "../pom/register";
import { TaskPage } from "../pom/tasks";

interface ExtendedFixtures {
    loginPage: LoginPage;
    registerPage: RegisterPage;
    taskPage: TaskPage
}

export const test = base.extend<ExtendedFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    registerPage: async ({ page }, use) => {
        const registerPage = new RegisterPage(page)
        await use(registerPage)
    },
    taskPage: async ({ page }, use) => {
        const taskPage = new TaskPage(page);
        await use(taskPage);
    },
});