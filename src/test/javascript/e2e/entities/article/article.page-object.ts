import { element, by } from 'protractor';

export class ArticleComponentsPage {
    createButton = element(by.css('#jh-create-entity'));
    title = element.all(by.css('jhi-article div h2#page-heading span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ArticleUpdatePage {
    PageTitle = element(by.css('h2#jhi-article-heading'));
    saveButton = element(by.css('#save-entity'));
    cancelButton = element(by.css('#cancel-save'));
    titleInput = element(by.css('input#field_title'));
    summaryInput = element(by.css('input#field_summary'));
    contentInput = element(by.css('textarea#field_content'));
    clickInput = element(by.css('input#field_click'));
    createInput = element(by.css('input#field_create'));
    updateInput = element(by.css('input#field_update'));
    userSelect = element(by.css('select#field_user'));
    categorySelect = element(by.css('select#field_category'));

    getPageTitle() {
        return this.PageTitle.getAttribute('jhiTranslate');
    }

    setTitleInput(title) {
        this.titleInput.sendKeys(title);
    }

    getTitleInput() {
        return this.titleInput.getAttribute('value');
    }

    setSummaryInput(summary) {
        this.summaryInput.sendKeys(summary);
    }

    getSummaryInput() {
        return this.summaryInput.getAttribute('value');
    }

    setContentInput(content) {
        this.contentInput.sendKeys(content);
    }

    getContentInput() {
        return this.contentInput.getAttribute('value');
    }

    setClickInput(click) {
        this.clickInput.sendKeys(click);
    }

    getClickInput() {
        return this.clickInput.getAttribute('value');
    }

    setCreateInput(create) {
        this.createInput.sendKeys(create);
    }

    getCreateInput() {
        return this.createInput.getAttribute('value');
    }

    setUpdateInput(update) {
        this.updateInput.sendKeys(update);
    }

    getUpdateInput() {
        return this.updateInput.getAttribute('value');
    }

    userSelectLastOption() {
        this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    userSelectOption(option) {
        this.userSelect.sendKeys(option);
    }

    getUserSelect() {
        return this.userSelect;
    }

    getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    categorySelectLastOption() {
        this.categorySelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    categorySelectOption(option) {
        this.categorySelect.sendKeys(option);
    }

    getCategorySelect() {
        return this.categorySelect;
    }

    getCategorySelectedOption() {
        return this.categorySelect.element(by.css('option:checked')).getText();
    }

    save() {
        this.saveButton.click();
    }

    cancel() {
        this.cancelButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
