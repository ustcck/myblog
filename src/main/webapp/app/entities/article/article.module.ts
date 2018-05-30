import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';

import { PersonalBlogSharedModule } from 'app/shared';
import { PersonalBlogAdminModule } from 'app/admin/admin.module';
import {
    ArticleService,
    ArticleComponent,
    ArticleDetailComponent,
    ArticleUpdateComponent,
    ArticleDeletePopupComponent,
    ArticleDeleteDialogComponent,
    articleRoute,
    articlePopupRoute,
    ArticleResolve,
    ArticleResolvePagingParams
} from './';

const ENTITY_STATES = [...articleRoute, ...articlePopupRoute];

@NgModule({
    imports: [PersonalBlogSharedModule, PersonalBlogAdminModule, RouterModule.forChild(ENTITY_STATES), QuillModule],
    declarations: [
        ArticleComponent,
        ArticleDetailComponent,
        ArticleUpdateComponent,
        ArticleDeleteDialogComponent,
        ArticleDeletePopupComponent
    ],
    entryComponents: [ArticleComponent, ArticleUpdateComponent, ArticleDeleteDialogComponent, ArticleDeletePopupComponent],
    providers: [ArticleService, ArticleResolve, ArticleResolvePagingParams],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonalBlogArticleModule {}
