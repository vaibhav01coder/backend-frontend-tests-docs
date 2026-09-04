const { test, expect } = require('@playwright/test');

// Feature: Task Categories and Search

test.beforeEach(async ({ request }) => {
    // clean slate — wipe tasks.json before each test
    await request.delete('http://localhost:4000/api/tasks/__reset').catch(() => {});
});

// ---------------------------------------------------------------------------
// Scenario: Create a task with a category
// Given the user is on the task manager page
// When the user enters "Buy milk" with category "Shopping"
// And clicks Add
// Then "Buy milk" should appear in the task list
// ---------------------------------------------------------------------------
test('Create a task with a category', async ({ page }) => {
    // Given: user is on the task manager page
    await page.goto('/');

    // When: user enters "Buy milk" with category "Shopping"
    await page.fill('#task-input', 'Buy milk');
    await page.selectOption('#category-select', 'Shopping');

    // And: clicks Add
    await page.click('#add-task');

    // Then: "Buy milk" should appear in the task list
    const taskList = page.locator('#taskList');
    await expect(taskList).toContainText('Buy milk');

    // And: the Shopping badge should be visible
    const badge = taskList.locator('.category-badge').first();
    await expect(badge).toHaveText('Shopping');
});

// ---------------------------------------------------------------------------
// Scenario: Search for a task
// Given tasks exist in the list
// When the user types "milk" in the search box
// Then only matching tasks are shown
// ---------------------------------------------------------------------------
test('Search for a task', async ({ page }) => {
    // Given: tasks exist in the list
    await page.goto('/');

    await page.fill('#task-input', 'Buy milk');
    await page.selectOption('#category-select', 'Shopping');
    await page.click('#add-task');
    await expect(page.locator('#taskList li')).toHaveCount(1);

    await page.fill('#task-input', 'Morning run');
    await page.selectOption('#category-select', 'Health');
    await page.click('#add-task');
    await expect(page.locator('#taskList li')).toHaveCount(2);

    await page.fill('#task-input', 'Send report');
    await page.selectOption('#category-select', 'Work');
    await page.click('#add-task');

    // confirm all 3 tasks are visible before searching
    await expect(page.locator('#taskList li')).toHaveCount(3);

    // When: user types "milk" in the search box
    await page.fill('#search-input', 'milk');

    // Then: only matching tasks are shown
    await expect(page.locator('#taskList li')).toHaveCount(1);
    await expect(page.locator('#taskList')).toContainText('Buy milk');
    await expect(page.locator('#taskList')).not.toContainText('Morning run');
    await expect(page.locator('#taskList')).not.toContainText('Send report');
});
