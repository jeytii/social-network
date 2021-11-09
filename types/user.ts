export interface User {
    slug: string;
    name: string;
    username: string;
    gender: 'Male' | 'Female';
    image_url: string | null;
    is_self: boolean;
    is_followed: boolean | null;
}
