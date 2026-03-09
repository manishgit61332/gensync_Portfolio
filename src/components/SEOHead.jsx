import { useEffect } from 'react';

/**
 * SEOHead — Lightweight per-page SEO component.
 * Updates document.title and meta description dynamically for each route.
 * No external dependency needed (no react-helmet).
 */
const SEOHead = ({ title, description }) => {
    useEffect(() => {
        // Update document title
        if (title) {
            document.title = title;
        }

        // Update meta description
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            }
        }

        // Update OG title
        if (title) {
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', title);
            const twTitle = document.querySelector('meta[name="twitter:title"]');
            if (twTitle) twTitle.setAttribute('content', title);
        }

        // Update OG description
        if (description) {
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', description);
            const twDesc = document.querySelector('meta[name="twitter:description"]');
            if (twDesc) twDesc.setAttribute('content', description);
        }
    }, [title, description]);

    return null; // Renders nothing — side-effect only
};

export default SEOHead;
