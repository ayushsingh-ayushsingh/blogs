import avatar from '../assets/images/avatar.jpg';
import hero from '../assets/images/hero.jpg';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://ayushthinks.pages.dev',
    // avatar: {
    //     src: avatar,
    //     alt: 'Ethan Donovan'
    // },
    title: 'Ayush Singh',
    subtitle: 'full-time learner',
    description: 'Namaste & welcome to my corner of the internet!',
    image: {
        src: '/ayush.jpg',
        alt: 'Ayush Singh - Avatar'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Blogs',
            href: '/blogs'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'Stories',
            href: '/stories'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    // footerNavLinks:
    socialLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        }
        // {
        //     text: 'Terms',
        //     href: '/terms'
        // },
        // {
        //     text: 'Download theme',
        //     href: 'https://github.com/JustGoodUI/dante-astro-theme'
        // }
    ],
    // socialLinks: [
    //     {
    //         text: 'Dribbble',
    //         href: 'https://dribbble.com/'
    //     },
    //     {
    //         text: 'Instagram',
    //         href: 'https://instagram.com/'
    //     },
    //     {
    //         text: 'X/Twitter',
    //         href: 'https://twitter.com/'
    //     }
    // ],
    hero: {
        title: 'Welcome to My Corner!',
        text: "I'm **Ayush Singh**, a Full-Stack developer based in Bhopal, India. My approach involves embracing intuition, conducting deep dives, and leveraging aesthetics.<br/></br>Feel free to explore some of my coding endeavors on [GitHub](https://github.com/ayushsingh-ayushsingh) or write a [Mail](mailto:ayushpno@gmail.com).",
        image: {
            src: hero,
            alt: 'A person sitting at a desk in front of a computer'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        enabled: true,
        title: 'Subscribe to Dante Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        form: {
            action: '#'
        }
    },
    postsPerPage: 5,
    projectsPerPage: 5,
    storiesPerPage: 5
};

export default siteConfig;
