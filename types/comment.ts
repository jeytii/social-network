import type { User } from './user';

export interface Comment {
    unique_key: string;
    slug: string;
    post_slug: string;
    body: string;
    likes_count: number;
    is_own_comment: boolean;
    is_liked: boolean;
    is_edited: boolean;
    timestamp: string;
    user: User;
}
