const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://localhost:4000',
        headless: true,
    },
    webServer: {
        command: 'node backend/server.js',
        url: 'http://localhost:4000',
        reuseExistingServer: false,
    },
});
