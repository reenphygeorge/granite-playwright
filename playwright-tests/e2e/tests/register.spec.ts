import { faker } from "@faker-js/faker";
import { test } from "../fixtures";

test.describe("Register page", () => {
    test("should register a new user", async ({ page, registerPage }) => {
        const name = faker.person.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        await page.goto("/");
        await registerPage.registerNewUser({ name, email, password });
    });
});