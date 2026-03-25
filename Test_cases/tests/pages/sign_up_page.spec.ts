import test, { expect } from "@playwright/test";
import { SignUp } from "../components/sign_up";
import * as fs from "fs";
import * as path from "path";
import { TOAST_TIMEOUT } from "../utils/constants";

const loadCSV = (filePath: string) => {
  const data = fs.readFileSync(filePath, "utf-8");
  const lines = data.split("\n").filter((line: string) => line.trim() !== "");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line: string) => {
    const values = line.split(",");
    const record: any = {};
    headers.forEach((header: string, index: number) => {
      record[header.trim()] = values[index] ? values[index].trim() : "";
    });
    return record;
  });
};

test.describe("Signup Page Data-Driven Testing", () => {
  let signUpPage: SignUp;
  const testData = loadCSV(path.join(__dirname, "../../data/sign_up.csv"));

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/signup");
    signUpPage = new SignUp(page);
  });

  for (const data of testData) {
    test(`${data.id} | ${data.description}`, async ({ page }) => {
      await signUpPage.signUp(
        data.name,
        data.email,
        data.password,
        data.confirmPassword,
        data.role
      );

      if (data.expectedResult === "success") {
        const toast = signUpPage.getToastMessage();
        await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
        await page.waitForURL("**/login");
        expect(page.url()).toContain("/login");
      } else {
        let validationLocator;
        
        switch (data.description) {
          case 'Empty Name':
            validationLocator = signUpPage.getValidationMessage(data.expectedMessage);
            break;
          case 'Invalid Email':
            validationLocator = signUpPage.getValidationMessage(data.expectedMessage);
            break;
          case 'Short Password':
            validationLocator = signUpPage.getValidationMessage(data.expectedMessage);
            break;
          case 'Password Mismatch':
            validationLocator = signUpPage.getValidationMessage(data.expectedMessage);
            break;
          case 'Empty Role':
            validationLocator = signUpPage.getValidationMessage(data.expectedMessage);
            break;
          default:
            throw new Error(`Unhandled scenario description: ${data.description}`);
        }

        if (validationLocator) {
          await expect(validationLocator).toBeVisible();
          await expect(validationLocator).toHaveText(data.expectedMessage);
        }
      }
    });
  }
});
