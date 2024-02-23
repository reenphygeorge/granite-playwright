import { Page, expect } from "@playwright/test";

interface CreateTaskAndVerify {
    taskName: string
    username: string
}

interface Comments {
    comment: string;
    taskName: string;
}

interface CommentCount {
    taskName: string;
    count: number;
}

interface taskNameOnly {
    taskName: string
}

export class TaskPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    createTaskAndVerify = async ({ taskName, username }: CreateTaskAndVerify) => {
        await this.page.getByTestId("navbar-add-todo-link").click();
        await this.page.getByTestId("form-title-field").fill(taskName);
        await this.page.locator(".css-2b097c-container").click();
        await this.page
            .locator(".css-26l3qy-menu")
            .getByText(username)
            .click();
        await this.page.getByTestId("form-submit-button").click();
        const taskInDashboard = this.page
            .getByTestId("tasks-pending-table")
            .getByRole("row", {
                name: new RegExp(taskName, "i"),
            });
        await taskInDashboard.scrollIntoViewIfNeeded();
        await expect(taskInDashboard).toBeVisible();
    };

    markTaskAsCompletedAndVerify = async ({ taskName }: taskNameOnly) => {
        await this.page
            .getByTestId("tasks-pending-table")
            .getByRole("row", { name: taskName })
            .getByRole("checkbox")
            .click();
        const completedTaskInDashboard = this.page
            .getByTestId("tasks-completed-table")
            .getByRole("row", { name: taskName });
        await completedTaskInDashboard.scrollIntoViewIfNeeded();
        await expect(completedTaskInDashboard).toBeVisible();
    };

    deleteTaskAndVerify = async ({ taskName }: taskNameOnly) => {
        const completedTaskInDashboard = this.page
            .getByTestId("tasks-completed-table")
            .getByRole("row", { name: taskName });
        await completedTaskInDashboard
            .getByTestId("completed-task-delete-link")
            .click();
        await expect(completedTaskInDashboard).toBeHidden();
        await expect(
            this.page
                .getByTestId("tasks-pending-table")
                .getByRole("row", { name: taskName })
        ).toBeHidden();
    };

    starTaskAndVerify = async ({ taskName }: taskNameOnly) => {
        const starIcon = this.page
            .getByTestId("tasks-pending-table")
            .getByRole("row", { name: taskName })
            .getByTestId("pending-task-star-or-unstar-link");
        await starIcon.click();
        await expect(starIcon).toHaveClass(/ri-star-fill/i);
        await expect(
            this.page.getByTestId("tasks-pending-table").getByRole("row").nth(1)
        ).toContainText(taskName);
    };

    createCommentAndVerify = async ({ comment, taskName }: Comments) => {
        const addCommentApi = this.page.waitForResponse(response =>
            response.url().includes(taskName.split(" ").join("-"))
        );
        await this.page.getByTestId("comments-text-field").fill(comment);
        await this.page.getByTestId("comments-submit-button").click();
        await addCommentApi;
        const element = this.page.getByText(comment);
        await expect(element).toContainText(comment);
    };

    checkForCount = async ({ taskName, count }: CommentCount) => {
        await this.page.goto("/");
        await expect(
            this.page
                .getByTestId("tasks-pending-table")
                .getByRole("row", {
                    name: taskName,
                })
                .getByRole("cell", {
                    name: `${count}`,
                })
        ).toBeVisible();
    };
}