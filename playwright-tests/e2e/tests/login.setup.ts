// login.setup.ts

import { STORAGE_STATE } from "../../playwright.config";
import { test } from "../fixtures";
import { creator } from "../../constants";

test.describe("Login page", () => {
    test("should login with the correct credentials", async ({
        page,
        loginPage,
    }) => {
        await page.goto("http://localhost:3000");
        await loginPage.loginAndVerifyUser(creator);
        await page.context().storageState({ path: STORAGE_STATE });
    });
});