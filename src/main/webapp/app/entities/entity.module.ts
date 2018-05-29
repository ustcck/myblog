import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PersonalBlogCategoryModule } from './category/category.module';
import { PersonalBlogArticleModule } from './article/article.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        PersonalBlogCategoryModule,
        PersonalBlogArticleModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonalBlogEntityModule {}
