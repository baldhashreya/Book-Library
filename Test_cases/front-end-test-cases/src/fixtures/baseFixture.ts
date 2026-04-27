import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/auth/login.page';
import { ResetPasswordPage } from '../pages/auth/reset-password.page';
import { SignUpPage } from '../pages/auth/sign-up.page';
import { AboutMePage } from '../pages/auth/about-me.page';
import { BookPage } from '../pages/books/book.page';
import { CreateBookPage } from '../pages/books/create-book.page';

// Define the custom fixtures types
type MyFixtures = {
    loginPage: LoginPage;
    resetPasswordPage: ResetPasswordPage;
    signUpPage: SignUpPage;
    aboutMePage: AboutMePage;
    bookPage: BookPage;
    createBookPage: CreateBookPage;
};

// Extend the base test with custom fixtures
export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    resetPasswordPage: async ({ page }, use) => {
        await use(new ResetPasswordPage(page));
    },
    signUpPage: async ({ page }, use) => {
        await use(new SignUpPage(page));
    },
    aboutMePage: async ({ page }, use) => {
        await use(new AboutMePage(page));
    },
    bookPage: async ({ page }, use) => {
        await use(new BookPage(page));
    },
    createBookPage: async ({ page }, use) => {
        await use(new CreateBookPage(page));
    }
});

export { expect } from '@playwright/test';
