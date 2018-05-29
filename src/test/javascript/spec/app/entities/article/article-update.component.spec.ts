/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PersonalBlogTestModule } from '../../../test.module';
import { ArticleUpdateComponent } from 'app/entities/article/article-update.component';
import { ArticleService } from 'app/entities/article/article.service';
import { Article } from 'app/shared/model/article.model';

import { UserService } from 'app/core';
import { CategoryService } from 'app/entities/category';

describe('Component Tests', () => {
    describe('Article Management Update Component', () => {
        let comp: ArticleUpdateComponent;
        let fixture: ComponentFixture<ArticleUpdateComponent>;
        let service: ArticleService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PersonalBlogTestModule],
                declarations: [ArticleUpdateComponent],
                providers: [UserService, CategoryService, ArticleService]
            })
                .overrideTemplate(ArticleUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ArticleUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ArticleService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Article(123);
                    spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({ body: entity })));
                    comp.article = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Article();
                    spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({ body: entity })));
                    comp.article = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
