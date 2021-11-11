import type { User } from './user';
import type { Post } from './post';

export interface Page {
    has_more: boolean;
    next_offset: number | null;
    status: number;
}

export interface UserPage extends Page {
    items: User[];
}

export interface PostPage extends Page {
    items: Post[];
}
