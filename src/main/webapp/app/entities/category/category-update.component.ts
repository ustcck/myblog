import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JhiAlertService } from 'ng-jhipster';

import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from './category.service';
import { IUser, UserService } from 'app/core';
import { IArticle } from 'app/shared/model/article.model';
import { ArticleService } from 'app/entities/article';

@Component({
    selector: 'jhi-category-update',
    templateUrl: './category-update.component.html'
})
export class CategoryUpdateComponent implements OnInit {
    private _category: ICategory;
    isSaving: boolean;

    users: IUser[];

    articles: IArticle[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private categoryService: CategoryService,
        private userService: UserService,
        private articleService: ArticleService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.route.data.subscribe(({ category }) => {
            this.category = category.body ? category.body : category;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.category.id !== undefined) {
            this.subscribeToSaveResponse(this.categoryService.update(this.category));
        } else {
            this.subscribeToSaveResponse(this.categoryService.create(this.category));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICategory>>) {
        result.subscribe((res: HttpResponse<ICategory>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackArticleById(index: number, item: IArticle) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
    get category() {
        return this._category;
    }

    set category(category: ICategory) {
        this._category = category;
    }
}
