Image assets guide

Current files used by the wedding day guide (organized per page under `public/pages`):

- Storyboard card thumbnails: `public/pages/storyboard/*.jpg` (message, notes, profile, photos, favorites-1, favorites-2, guide, thanks)
- Seating card: `public/pages/seating/ring.jpg`
- Profile portraits: `public/pages/profile/groom.jpg`, `public/pages/profile/bride.jpg`
- Favorites 1: `public/pages/favorites-1/201579_0.jpg` (and related images)
- Favorites 2: `public/pages/favorites-2/IMG_8799.jpg` (and related images)
- Guide backgrounds: `public/pages/guide/grass-tile.svg`, `public/pages/guide/river-main.svg`, `public/pages/guide/forest-left.svg`, `public/pages/guide/forest-right.svg`
- Thanks ranking images: `public/pages/thanks/3note.jpg`, `public/pages/thanks/202088.jpg`
- Shared assets: `public/shared/favicon.png`, `public/shared/favicon.ico`
- Seating PDF: `public/seating.pdf`

Notes

- If you replace any image, keep the same filename or update paths in `server/data/event.ts` and the relevant page components (for example `app/pages/favorites-1.vue`).
