export interface ModifyItem {
    type: 'post' | 'comment';
    parentSlug: string;
    slug: string;
    value: string;
}
