# Migration Testing Checklist

After migrating from Vite/React Router to Next.js, check these items:

## Navigation

- [ ] Home page loads correctly
- [ ] Clicking on links navigates to correct pages
- [ ] Back/forward browser buttons work
- [ ] Dynamic routes (like chat/[chatId]) work correctly
- [ ] URL parameters are correctly processed
- [ ] Search/query parameters work correctly

## Components

- [ ] Client components have "use client" directive
- [ ] Server components work correctly without "use client"
- [ ] All UI components render correctly
- [ ] No React Router imports remain
- [ ] All components using hooks like useState have "use client"

## Styling

- [ ] All styles are applied correctly
- [ ] Dark/light mode works (if applicable)
- [ ] Responsive design works

## Data Fetching

- [ ] API calls work correctly
- [ ] Data is displayed correctly
- [ ] Server components fetch data correctly

## Metadata

- [ ] Page titles are correct
- [ ] Meta descriptions are correct
- [ ] Any other metadata (like Open Graph) is correctly set

## Other

- [ ] No console errors
- [ ] All features from the original app work
