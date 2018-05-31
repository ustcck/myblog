import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { JhiAlertService } from 'ng-jhipster';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { LoginModalService, Principal, Account } from 'app/core';
import { ArticleService } from 'app/entities/article/article.service';
import { IArticle } from 'app/shared/model/article.model';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    articles: IArticle[];

    constructor(private principal: Principal,
                private jhiAlertService: JhiAlertService,
                private loginModalService: LoginModalService,
                private articleService: ArticleService,
                private eventManager: JhiEventManager) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
                const s = 0;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
                const s = 0;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
