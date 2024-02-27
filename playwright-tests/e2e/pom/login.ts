import { Page, expect } from '@playwright/test';

interface LoginAndVerifyUser {
    username: string
    email: string
    password: string
}

export default class LoginPage {
    page: Page
    constructor(page: Page) {
        this.page = page;
    }

    loginAndVerifyUser = async ({ username, email, password }: LoginAndVerifyUser) => {
        await this.page.getByTestId("login-email-field").fill(email);
        await this.page.getByTestId("login-password-field").fill(password);
        await this.page.getByTestId("login-submit-button").click();
        await expect(this.page.getByTestId("navbar-username-label")).toBeVisible();
        await expect(this.page.getByTestId("navbar-username-label")).toContainText(
            username
        );
        await expect(this.page.getByTestId("navbar-logout-link")).toBeVisible();
    };
}
