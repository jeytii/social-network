import { ComponentType } from 'react';
import Posts from 'components/layouts/profile/Posts';
import Likes from 'components/layouts/profile/Likes';
import Comments from 'components/layouts/profile/Comments';
import Bookmarks from 'components/layouts/profile/Bookmarks';
import ProfileSectionNotFound from 'components/layouts/profile/NotFound';

export default function useProfileSection(section?: string | string[]): ComponentType {
    const routeSection = Array.isArray(section) && !!section.length ? `/${section.join('/')}` : '/';

    if (routeSection === '/') {
        return Posts;
    }

    if (routeSection === '/likes') {
        return Likes;
    }

    if (routeSection === '/comments') {
        return Comments;
    }

    if (routeSection === '/bookmarks') {
        return Bookmarks;
    }

    return ProfileSectionNotFound;
}
