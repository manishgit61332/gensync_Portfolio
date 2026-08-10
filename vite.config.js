import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        labs: resolve(__dirname, 'labs.html'),
        careers: resolve(__dirname, 'careers.html'),
        startup_marketing: resolve(__dirname, 'startup-marketing-agency.html'),
        b2b_content_marketing: resolve(__dirname, 'b2b-content-marketing.html'),
        founder_personal_branding: resolve(__dirname, 'founder-personal-branding.html'),
        lead_generation: resolve(__dirname, 'lead-generation-for-startups.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        blog_first_10_b2b_clients: resolve(__dirname, 'blog/how-to-get-first-10-b2b-clients.html'),
        blog_startup_marketing_strategy: resolve(__dirname, 'blog/startup-marketing-strategy-2026.html'),
        blog_cold_outreach: resolve(__dirname, 'blog/cold-outreach-that-converts.html'),
        blog_why_content_fails: resolve(__dirname, 'blog/why-startup-content-fails.html'),
        blog_b2b_lead_generation: resolve(__dirname, 'blog/b2b-lead-generation-startups.html'),
        blog_linkedin_strategy: resolve(__dirname, 'blog/linkedin-strategy-technical-founders.html'),
        blog_content_marketing_roi: resolve(__dirname, 'blog/content-marketing-roi.html'),
        blog_startup_growth_channels: resolve(__dirname, 'blog/startup-growth-channels.html'),
        cme_case_study: resolve(__dirname, 'case-studies/cme.html'),
        geodo_case_study: resolve(__dirname, 'case-studies/geodo.html'),
        connectme_work: resolve(__dirname, 'CONNECTME_WORK.html'),
        geodo_work: resolve(__dirname, 'GEODO_WORK.html'),
        crm: resolve(__dirname, 'crm/index.html'),
        not_found: resolve(__dirname, '404.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
