import { IUser } from 'app/core/user/user.model';
import { IArticle } from './article.model';

export interface ICategory {
    id?: number;
    name?: string;
    user?: IUser;
    articles?: IArticle[];
}

export class Category implements ICategory {
    constructor(public id?: number, public name?: string, public user?: IUser, public articles?: IArticle[]) {}
}
