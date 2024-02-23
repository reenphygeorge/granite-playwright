import { test } from "../fixtures";
import { faker } from "@faker-js/faker";
import { expect } from "playwright/test";
import { creator } from "../../constants";

const { username } = creator
test.describe("Tasks page", () => {
    
    let taskName: string;

    test.beforeEach(() => {
        taskName = faker.word.words({ count: 5 });
    });

    test("should create a new task with creator as the assignee", async ({
        page,
        taskPage,
    }) => {
        await page.goto("/");
        await taskPage.createTaskAndVerify({ taskName, username });
    });


    test("should be able to mark a task as completed", async ({
        page,
        taskPage,
    }) => {
        await page.goto("/");
        await test.step("Step 1: Create new task", async () => {
            await taskPage.createTaskAndVerify({ taskName, username });
        })
        await test.step("Step 2: Mark the created task as completed", async () => {
            await taskPage.markTaskAsCompletedAndVerify({ taskName })
        })
    });

    test("should be able to delete a completed task", async ({
        page,
        taskPage,
    }) => {
        await page.goto("/");
        await test.step("Step 1: Create new task", async () => {
            await taskPage.createTaskAndVerify({ taskName, username });
        })
        await test.step("Step 2: Mark the created task as completed", async () => {
            await taskPage.markTaskAsCompletedAndVerify({ taskName });
        })
        await test.step("Step 3: Delete the previously marked task as completed", async () => {
            await taskPage.deleteTaskAndVerify({ taskName });
        })
    });
});

test.describe("Starring tasks feature", () => {
    
    let taskName: string;
    
    test.beforeEach(() => {
        taskName = faker.word.words({ count: 5 });
    });
    
    test.describe.configure({ mode: "serial" });

    test("should be able to star a pending task", async ({
        page,
        taskPage
    }) => {
        page.goto("/");
        await test.step("Step 1: Create new task", async () => {
            await taskPage.createTaskAndVerify({ taskName, username });
        })
        await test.step("Step 2: Star the previously created task", async () => {
            await taskPage.starTaskAndVerify({ taskName });
        })
    });

    test("should be able to un-star a pending task", async ({
        page,
        taskPage
    }) => {
        await page.goto("/");
        await test.step("Step 1: Create new task", async () => {
            await taskPage.createTaskAndVerify({ taskName, username });
        })
        await test.step("Step 2: Star the previously created task", async () => {
            await taskPage.starTaskAndVerify({ taskName });
        })
        await test.step("Step 3: Unstar the previously starred pending task", async () => {
            const starIcon = page
                .getByTestId("tasks-pending-table")
                .getByRole("row", { name: taskName })
                .getByTestId("pending-task-star-or-unstar-link");
            await starIcon.click();
            await expect(starIcon).toHaveClass(/ri-star-line/);
        })
    });
});