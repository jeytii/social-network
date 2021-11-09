import type { User } from './user';

export interface Post {
    slug: string;
    body: string;
    likes_count: number;
    comments_count: number;
    is_own_post: boolean;
    is_liked: boolean;
    is_edited: boolean;
    is_bookmarked: boolean;
    timestamp: string;
    user: User;
}
