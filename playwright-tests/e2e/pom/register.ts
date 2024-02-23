import { Page, expect } from '@playwright/test';

export default class RegisterPage {
    page: Page
    constructor(page: Page) {
        this.page = page;
    }

    registerNewUser = async ({ name, email, password }: { name: string, email: string, password: string }) => {
        await this.page.getByTestId("login-register-link").click();
        await this.page.getByTestId("signup-name-field").fill(name);
        await this.page.getByTestId("signup-email-field").fill(email);
        await this.page.getByTestId("signup-password-field").fill(password);
        await this.page
            .getByTestId("signup-password-confirmation-field")
            .fill(password);
        await this.page.getByTestId("signup-submit-button").click();
        await this.page.getByTestId("login-email-field").fill(email);
        await this.page.getByTestId("login-password-field").fill(password);
        await this.page.getByTestId("login-submit-button").click();
        await expect(this.page.getByTestId("navbar-username-label")).toContainText(
            name
        );
        await expect(this.page.getByTestId("navbar-logout-link")).toBeVisible();
    };
}
