import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { ICategory } from './category.model';

export interface IArticle {
    id?: number;
    title?: string;
    summary?: string;
    content?: any;
    click?: number;
    create?: Moment;
    update?: Moment;
    user?: IUser;
    categories?: ICategory[];
}

export class Article implements IArticle {
    constructor(
        public id?: number,
        public title?: string,
        public summary?: string,
        public content?: any,
        public click?: number,
        public create?: Moment,
        public update?: Moment,
        public user?: IUser,
        public categories?: ICategory[]
    ) {}
}
