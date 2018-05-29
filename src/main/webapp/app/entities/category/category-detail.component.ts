import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategory } from 'app/shared/model/category.model';

@Component({
    selector: 'jhi-category-detail',
    templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnInit {
    category: ICategory;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(({ category }) => {
            this.category = category.body ? category.body : category;
        });
    }

    previousState() {
        window.history.back();
    }
}
