import type { User } from './user';
import type { Post } from './post';
import type { Comment } from './comment';
import type { Notification } from './notification';

export interface Page {
    next_offset: number | null;
    status: number;
}

export interface UserPage extends Page {
    items: User[];
}

export interface PostPage extends Page {
    items: Post[];
}

export interface CommentPage extends Page {
    items: Comment[];
}

export interface NotificationPage extends Page {
    items: Notification[];
}
