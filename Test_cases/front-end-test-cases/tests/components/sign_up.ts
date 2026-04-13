import { Page, Locator } from "@playwright/test";
import { CommonActions } from "../utils/common";

export class SignUp {
    private page: Page;
    private commonActions: CommonActions;
    

    constructor(page: Page) {
        this.page = page;
        this.commonActions = new CommonActions(page);
    }

    getToastMessage(): Locator {
    return this.commonActions.getToastMessage();
  }


  getValidationMessage(message: string): Locator {
    return this.commonActions.getValidationMessage(message);
  }


    async signUp (name:string,email:string,password:string,confirmPassword:string,role:string) {
        await this.commonActions.navigateTo("/signup");   
        await this.commonActions.fillForm("Enter name", name);
        await this.commonActions.fillForm("Enter email", email);
        await this.commonActions.fillForm("Enter password", password);
        await this.commonActions.fillForm("Confirm password", confirmPassword);
        await this.commonActions.selectDropdown("Select Role", role);
        await this.commonActions.clickButton("Sign Up");
    }
}
