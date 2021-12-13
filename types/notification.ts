export interface Notification {
    slug: string;
    message: string;
    url: string;
    is_read: boolean;
    user: {
        name: string;
        gender: 'Male' | 'Female';
        image_url: string | null;
    };
}
