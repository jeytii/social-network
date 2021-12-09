export interface Notification {
    slug: string;
    message: string;
    action: number;
    path: string;
    is_read: boolean;
    user: {
        name: string;
        gender: 'Male' | 'Female';
        image_url: string | null;
    };
}
