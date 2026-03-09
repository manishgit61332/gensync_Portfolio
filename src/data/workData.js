

import AmesPdf from '../assets/Portfolio/website/AMES/AMES.pdf';
import AmesThumb from '../assets/Portfolio/website/AMES/thumbnail.png';
import ConnectMePdf from '../assets/Portfolio/website/CME/connectme_style_guide.pdf';
import CmeThumb from '../assets/Portfolio/website/CME/cme_thumbnail.png';
import PlayaPdf from '../assets/Portfolio/website/Playa/playa_case_study.pdf';
import PlayaThumb from '../assets/Portfolio/website/Playa/playa_thumbnail.png';

// Branding Assets
import IfsPdf from '../assets/Portfolio/Branding and Identity/IFS Brand Identity.pdf';
import IfsThumb from '../assets/Portfolio/Branding and Identity/IFS Thumbnail.png';
import ProjectXPdf from '../assets/Portfolio/Branding and Identity/ProjeectX/ProjectXB.pdf';
import ProjectXThumb from '../assets/Portfolio/Branding and Identity/ProjeectX/thumbnail.png';

import LongFormThumb from '../assets/Portfolio/Videos/Long form.png';
import LiveEventThumb from '../assets/Portfolio/Videos/live event.png';

// Card Thumbnails
import WebsitesThumb from '../assets/thumbnails/websites.png';
import FilmsThumb from '../assets/thumbnails/films.png';
import BrandingThumb from '../assets/thumbnails/branding.png';
import SocialThumb from '../assets/thumbnails/social.png';
import LabsThumb from '../assets/thumbnails/labs.png';

export const WORK_FOLDERS = [
    {
        id: 'web-experiences',
        title: 'Websites',
        description: 'Immersive sites that convert.',
        subtitle: 'High-Performance Sites',
        bg: '#051408',
        img: WebsitesThumb,
        color: '#E3FFEB',
        projects: [
            {
                title: 'ConnectME',
                type: 'Web Platform & Identity',
                pdf: ConnectMePdf,
                img: CmeThumb,
                link: 'https://connect-me-v14.vercel.app/'
            },
            {
                title: 'AMES',
                type: 'Corporate Website',
                pdf: AmesPdf,
                img: AmesThumb
            },
            {
                title: 'Playa',
                type: 'Gaming Community Website',
                pdf: PlayaPdf,
                img: PlayaThumb
            }
        ],
        moreWork: [
            {
                title: 'WNE3',
                type: 'Web3 Experience',
                link: 'https://www.wne3.com'
            },
            {
                title: 'Aurax',
                type: 'Corporate Website',
                link: 'https://www.aurax.co.in/'
            },
            {
                title: 'Mad Scientist',
                type: 'Portfolio / Creative',
                link: 'https://madscientist.tech/'
            },
            {
                title: 'The Build Club',
                type: 'Community Platform',
                link: 'https://thebuildclub.in/'
            }
        ],
        testimonials: [
            { quote: "Each of these sites was built to convert — not just look good. We obsess over load times, scroll behavior, and CTA placement.", author: "Gensync", role: "Design Team" }
        ],
        details: "Every site we build is a conversion engine first, portfolio piece second."
    },
    {
        id: 'product-commercials',
        title: 'Films & Motion',
        description: 'High-octane visuals.',
        subtitle: '3D & Film Production',
        bg: '#1f0b00',
        img: FilmsThumb,
        color: '#FF7701',
        projects: [
            { title: 'DetectifyAI', type: 'AI Product Launch', youtubeId: '8M6dQsMxPAQ' },
            { title: 'ConnectME AI', type: 'AI Commercial', youtubeId: 'inCvbw8sFEY' },
            { title: 'ProjectX Infinity', type: '3D Teaser', youtubeId: 'vQPAqghlIBM' },
            { title: 'AI Product Showcase', type: 'Use-Case Film', youtubeId: '6En4lSzsiOc' },
            { title: 'Cultural Fest', type: 'Aftermovie Teaser', youtubeId: '1znH3Y0jOkQ' },
            { title: 'BayLink', type: 'Product Explainer', youtubeId: 'MN7Ci83ZFhw' },
            { title: 'Street Style Interview', type: 'Viral Interview (200k+)', youtubeId: 'YwRZnXPOQbc' },
            { title: 'Challenge Video', type: 'Engaging Edit', youtubeId: 'cDT2qDE9QVc' },
            { title: 'Podcast Edit', type: 'Long Form Edit', youtubeId: 's7c9RapKnBg' },
            { title: 'Cinematic Edit', type: 'Long Form', driveId: '1BNcHbCYlwGpPVwTtmjZKEfjhSMqdtWJE', img: LongFormThumb },
            { title: 'Concert Film', type: 'Live Event', driveId: '1HroW6s38-IXYSlCSs5qxavbiZAJxLoF8', img: LiveEventThumb }
        ],
        testimonials: [
            { quote: "Every project here started with a tight brief and a clear story. The visuals came after the thinking.", author: "Gensync", role: "Production Team" }
        ],
        details: "From 3D product films to event coverage — every frame is intentional."
    },
    {
        id: 'branding',
        title: 'Branding',
        description: 'Identity systems that stick.',
        subtitle: 'Logo & Identity',
        bg: '#1a0507',
        img: BrandingThumb,
        color: '#FF9F9F',
        projects: [
            {
                title: 'IFS',
                type: 'Brand Identity',
                pdf: IfsPdf,
                img: IfsThumb
            },
            {
                title: 'Project X',
                type: 'Brand Strategy',
                pdf: ProjectXPdf,
                img: ProjectXThumb
            }
        ],
        testimonials: [
            { quote: "We don't design logos in isolation. Every identity system ships with usage guidelines, color specs, and typography rules.", author: "Gensync", role: "Brand Team" }
        ],
        details: "Identity systems — type, color, voice, motion — designed to scale."
    },
    {
        id: 'social-campaigns',
        title: 'Social Content',
        description: 'Content that spreads.',
        subtitle: 'Viral Growth Assets',
        bg: '#140505',
        img: SocialThumb,
        color: '#C27B7F',
        projects: [
            { title: '2025 Showreel', type: 'Agency Reel', youtubeId: 'e8sbDDwoQsI', isShort: true },
            { title: 'Restaurant Promo', type: 'Brand Promotion', youtubeId: 'YuO6x4xBVJI', isShort: true },
            { title: 'Study Abroad', type: 'UGC Video', youtubeId: 'YeNXhcuQ8NU', isShort: true },
            { title: 'Podcast Clip', type: 'Short Form', youtubeId: 'AII2yVENco8', isShort: true },
            { title: 'Quick Cut', type: 'Short Form Edit', youtubeId: 'qdzgwLNigos', isShort: true },
            { title: 'Lifestyle Edit', type: 'Creative Short', youtubeId: 'BSiPicgRTSg', isShort: true }
        ],
        testimonials: [
            { quote: "Short form that stops the scroll. We handle the edit, pacing, and hooks — you just show up.", author: "Gensync", role: "Content Team" }
        ],
        details: "Scroll-stopping short form. We handle edit, pacing, and hooks."
    },
    {
        id: 'gensync-labs',
        title: 'Gensync Labs',
        description: 'Experimental R&D.',
        subtitle: 'The Future.',
        bg: '#001a1a', // Deep Cyan/Black
        img: LabsThumb,
        color: '#00FFFF', // Cyan/Electric Blue
        comingSoon: true, // Flag for behavior
        projects: [], // Empty
        testimonials: [],
        details: "Where we build the tools that build the future."
    }
];
