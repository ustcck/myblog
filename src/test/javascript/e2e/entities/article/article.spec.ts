import { browser } from 'protractor';
import { NavBarPage } from './../../page-objects/jhi-page-objects';
import { ArticleComponentsPage, ArticleUpdatePage } from './article.page-object';

describe('Article e2e test', () => {
    let navBarPage: NavBarPage;
    let articleUpdatePage: ArticleUpdatePage;
    let articleComponentsPage: ArticleComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Articles', () => {
        navBarPage.goToEntity('article');
        articleComponentsPage = new ArticleComponentsPage();
        expect(articleComponentsPage.getTitle()).toMatch(/personalBlogApp.article.home.title/);
    });

    it('should load create Article page', () => {
        articleComponentsPage.clickOnCreateButton();
        articleUpdatePage = new ArticleUpdatePage();
        expect(articleUpdatePage.getPageTitle()).toMatch(/personalBlogApp.article.home.createOrEditLabel/);
        articleUpdatePage.cancel();
    });

    it('should create and save Articles', () => {
        articleComponentsPage.clickOnCreateButton();
        articleUpdatePage.setTitleInput('title');
        expect(articleUpdatePage.getTitleInput()).toMatch('title');
        articleUpdatePage.setSummaryInput('summary');
        expect(articleUpdatePage.getSummaryInput()).toMatch('summary');
        articleUpdatePage.setContentInput('content');
        expect(articleUpdatePage.getContentInput()).toMatch('content');
        articleUpdatePage.setClickInput('5');
        expect(articleUpdatePage.getClickInput()).toMatch('5');
        articleUpdatePage.setCreateInput('2000-12-31');
        expect(articleUpdatePage.getCreateInput()).toMatch('2000-12-31');
        articleUpdatePage.setUpdateInput('2000-12-31');
        expect(articleUpdatePage.getUpdateInput()).toMatch('2000-12-31');
        articleUpdatePage.userSelectLastOption();
        // articleUpdatePage.categorySelectLastOption();
        articleUpdatePage.save();
        expect(articleUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});
