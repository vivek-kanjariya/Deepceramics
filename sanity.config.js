// sanity.config.js
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  basePath: '/studio', // This hosts the dashboard layout at deepceramics.in/studio
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mqs3cysb',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: [
      {
        name: 'blog',
        type: 'document',
        title: 'Blog Post',
        fields: [
          { name: 'title', type: 'string', title: 'Title' },
          { 
            name: 'slug', 
            type: 'slug', 
            title: 'Slug', 
            options: { source: 'title', maxLength: 96 } 
          },
          { name: 'mainImage', type: 'image', title: 'Main Image', options: { hotspot: true } },
          { name: 'publishedAt', type: 'datetime', title: 'Published at' },
          { name: 'body', type: 'array', title: 'Body Content', of: [{ type: 'block' }] },
        ],
      },
    ],
  },
});
