import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IArticle } from 'app/shared/model/article.model';

@Component({
    selector: 'jhi-article-detail',
    templateUrl: './article-detail.component.html'
})
export class ArticleDetailComponent implements OnInit {
    article: IArticle;

    constructor(private dataUtils: JhiDataUtils, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(({ article }) => {
            this.article = article.body ? article.body : article;
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }
}
