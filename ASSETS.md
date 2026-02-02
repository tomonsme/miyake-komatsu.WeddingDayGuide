Image assets guide

Current files used by the wedding day guide (organized per page under `public/pages`):

- Storyboard card thumbnails: `public/pages/storyboard/*.jpg` (message, seating, notes, profile, photos, favorites-1, favorites-2, guide, thanks)

- Seating card: `public/pages/seating/ritz-lounge.jpg`
- Notes card: `public/pages/notes/202082.jpg`
- Profile card + portraits: `public/pages/profile/two.JPG`, `public/pages/profile/groom.jpg`, `public/pages/profile/bride.jpg`
- Message card: `public/pages/message/202080.jpg`
- Favorites 1: `public/pages/favorites-1/201579_0.jpg` (and related images)
- Favorites 2: `public/pages/favorites-2/IMG_8799.jpg` (and related images)
- Photos card: `public/pages/photos/story-4.jpg`
- Guide card: `public/pages/guide/night-1.jpg`
- Thanks card: `public/pages/thanks/202081.jpg`
- Shared assets: `public/shared/favicon.png`

Notes

- If you replace any image, keep the same filename or update paths in `server/data/event.ts` and the relevant page components (for example `app/pages/favorites-1.vue`).
- Monogram is optional. If you add one, set `monogramUrl` in `app/app.config.ts` and it will appear in the footer.
