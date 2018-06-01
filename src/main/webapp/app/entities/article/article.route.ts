import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from 'app/core';
import { Article } from 'app/shared/model/article.model';
import { ArticleService } from './article.service';
import { ArticleComponent } from './article.component';
import { ArticleDetailComponent } from './article-detail.component';
import { ArticleUpdateComponent } from './article-update.component';
import { ArticleDeletePopupComponent } from './article-delete-dialog.component';

@Injectable()
export class ArticleResolvePagingParams implements Resolve<any> {
    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

@Injectable()
export class ArticleResolve implements Resolve<any> {
    constructor(private service: ArticleService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id);
        }
        return new Article();
    }
}

export const articleRoute: Routes = [
    {
        path: 'article',
        component: ArticleComponent,
        resolve: {
            pagingParams: ArticleResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'personalBlogApp.article.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'article/:id/view',
        component: ArticleDetailComponent,
        resolve: {
            article: ArticleResolve
        },
        data: {
            authorities: [], // 'ROLE_USER'
            pageTitle: 'personalBlogApp.article.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'article/new',
        component: ArticleUpdateComponent,
        resolve: {
            article: ArticleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'personalBlogApp.article.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'article/:id/edit',
        component: ArticleUpdateComponent,
        resolve: {
            article: ArticleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'personalBlogApp.article.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const articlePopupRoute: Routes = [
    {
        path: 'article/:id/delete',
        component: ArticleDeletePopupComponent,
        resolve: {
            article: ArticleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'personalBlogApp.article.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
