export interface ModifyItem {
    type: 'post' | 'comment';
    slug: string;
    value: string;
}
