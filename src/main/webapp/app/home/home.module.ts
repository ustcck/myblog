import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PersonalBlogSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { CarouselComponent } from 'app/home/carousel/carousel.component';

@NgModule({
    imports: [PersonalBlogSharedModule, RouterModule.forChild([HOME_ROUTE])],
    declarations: [HomeComponent, CarouselComponent],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonalBlogHomeModule {}
