import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PersonalBlogSharedModule } from 'app/shared';
import { PersonalBlogAdminModule } from 'app/admin/admin.module';
import {
    CategoryService,
    CategoryComponent,
    CategoryDetailComponent,
    CategoryUpdateComponent,
    CategoryDeletePopupComponent,
    CategoryDeleteDialogComponent,
    categoryRoute,
    categoryPopupRoute,
    CategoryResolve
} from './';

const ENTITY_STATES = [...categoryRoute, ...categoryPopupRoute];

@NgModule({
    imports: [PersonalBlogSharedModule, PersonalBlogAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CategoryComponent,
        CategoryDetailComponent,
        CategoryUpdateComponent,
        CategoryDeleteDialogComponent,
        CategoryDeletePopupComponent
    ],
    entryComponents: [CategoryComponent, CategoryUpdateComponent, CategoryDeleteDialogComponent, CategoryDeletePopupComponent],
    providers: [CategoryService, CategoryResolve],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonalBlogCategoryModule {}
