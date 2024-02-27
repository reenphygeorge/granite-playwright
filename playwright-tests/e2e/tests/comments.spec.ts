//comments-spec.ts
import { expect } from "@playwright/test";
import { test } from "../fixtures/index";
import { assignee } from "../../constants";
import { TaskPage } from "../pom/tasks";
import { faker } from "@faker-js/faker";
import LoginPage from "../pom/login";
import { hyphenize } from "../utils/hyphenize";

test.describe("Comment Page", () => {
    let todoName: string;
    let assigneeComment: string;
    let creatorComment: string;

    test.beforeEach(() => {
        todoName = faker.word.verb(5);
        assigneeComment = faker.lorem.sentence();
        creatorComment = faker.lorem.sentence();
    });

    test("Comment on task as creator and assigned user", async ({
        page,
        browser,
        taskPage,
    }) => {
        await page.goto("/");

        await test.step("step 1 - Create a new task and assign it to other user", () =>
            taskPage.createTaskAndVerify({
                taskName: todoName,
                username: "Sam Smith",
            }));

        await test.step("step 2 - Go to the previously created task", async () => {
            // const endPoint = todoName.replace(/\s+/g, "-");
            const waitForTask = page.waitForResponse(response =>
                response.url().includes(hyphenize(todoName))
            );
            await page.getByTestId("tasks-pending-table").getByText(todoName).click();
            await waitForTask;
            await await expect(page.locator("h1")).toHaveText(todoName);
        });

        await test.step("step 3 - Create comment as creator in the todo and verify", () =>
            taskPage.createCommentAndVerify({
                comment: creatorComment,
                taskName: todoName,
            }));

        await test.step("step 4 - Check if comment count was increased for the task", () =>
            taskPage.checkForCount({
                taskName: todoName,
                count: 1,
            }));

        const assigneeContext = await browser.newContext({
            storageState: { cookies: [], origins: [] },
        });

        const assigneePage = await assigneeContext.newPage();

        let assigneeTasks: TaskPage;
        let assigneeAuth: LoginPage;

        await test.step("step 5 - Create new browser window for assignee", async () => {
            assigneeAuth = new LoginPage(assigneePage);
            assigneeTasks = new TaskPage(assigneePage);
        });

        await test.step("step 6  - Login as assignee and go to the assigned task", async () => {
            await assigneePage.goto("/");

            // const endPoint = todoName.replace(/\s+/g, "-");

            const taskDetailsApi = assigneePage.waitForResponse(response =>
                response.url().includes(hyphenize(todoName))
            );
            await assigneeAuth.loginAndVerifyUser(assignee);
            await assigneePage
                .getByTestId("tasks-pending-table")
                .getByText(todoName)
                .click();
            await taskDetailsApi;

            await expect(assigneePage.locator("h1")).toHaveText(todoName);
        });

        await test.step("step 7 - Create comment as assigned user", () =>
            assigneeTasks.createCommentAndVerify({
                comment: assigneeComment,
                taskName: todoName,
            }));

        await test.step("step 8 - Check for comment count", () =>
            assigneeTasks.checkForCount({
                taskName: todoName,
                count: 2,
            }));

        await assigneePage.close();
        await assigneeContext.close();
    });
});