import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config.ts';
import { sortItemsByDateDesc } from '../utils/data-utils.ts';

export async function GET(context) {
    const posts = await getCollection('blogs');
    const stories = await getCollection('stories');

    const items = [...posts, ...stories].sort(sortItemsByDateDesc);

    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        items: items.map((item) => ({
            title: item.data.title,
            description: item.data.excerpt,
            link: item.collection === 'blogs' ? `/blogs/${item.id}/` : `/stories/${item.id}/`,
            pubDate: item.data.publishDate
        }))
    });
}
