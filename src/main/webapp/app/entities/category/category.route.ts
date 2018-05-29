import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { Category } from 'app/shared/model/category.model';
import { CategoryService } from './category.service';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category-detail.component';
import { CategoryUpdateComponent } from './category-update.component';
import { CategoryDeletePopupComponent } from './category-delete-dialog.component';

@Injectable()
export class CategoryResolve implements Resolve<any> {
    constructor(private service: CategoryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id);
        }
        return new Category();
    }
}

export const categoryRoute: Routes = [
    {
        path: 'category',
        component: CategoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'personalBlogApp.category.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'category/:id/view',
        component: CategoryDetailComponent,
        resolve: {
            category: CategoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'personalBlogApp.category.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'category/new',
        component: CategoryUpdateComponent,
        resolve: {
            category: CategoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'personalBlogApp.category.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'category/:id/edit',
        component: CategoryUpdateComponent,
        resolve: {
            category: CategoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'personalBlogApp.category.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categoryPopupRoute: Routes = [
    {
        path: 'category/:id/delete',
        component: CategoryDeletePopupComponent,
        resolve: {
            category: CategoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'personalBlogApp.category.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
