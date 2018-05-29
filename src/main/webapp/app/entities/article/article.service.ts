import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IArticle } from 'app/shared/model/article.model';

type EntityResponseType = HttpResponse<IArticle>;
type EntityArrayResponseType = HttpResponse<IArticle[]>;

@Injectable()
export class ArticleService {
    private resourceUrl = SERVER_API_URL + 'api/articles';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/articles';

    constructor(private http: HttpClient) {}

    create(article: IArticle): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(article);
        return this.http
            .post<IArticle>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertDateFromServer(res));
    }

    update(article: IArticle): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(article);
        return this.http
            .put<IArticle>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertDateFromServer(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IArticle>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertDateFromServer(res));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IArticle[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IArticle[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res));
    }

    private convertDateFromClient(article: IArticle): IArticle {
        const copy: IArticle = Object.assign({}, article, {
            create: article.create != null && article.create.isValid() ? article.create.toJSON() : null,
            update: article.update != null && article.update.isValid() ? article.update.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.create = res.body.create != null ? moment(res.body.create) : null;
        res.body.update = res.body.update != null ? moment(res.body.update) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((article: IArticle) => {
            article.create = article.create != null ? moment(article.create) : null;
            article.update = article.update != null ? moment(article.update) : null;
        });
        return res;
    }
}
