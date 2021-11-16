import type { User } from './user';

export interface Comment {
    slug: string;
    body: string;
    likes_count: number;
    is_own_comment: boolean;
    is_liked: boolean;
    is_edited: boolean;
    timestamp: string;
    user: User;
}
