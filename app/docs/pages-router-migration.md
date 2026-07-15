# Pages Router migration

The project is now routed through the Pages Router:

- `src/pages` owns all public routes and API routes.
- `src/views` contains the non-route page view components that used to live under `src/app`.
- `src/styles` contains global CSS and font declarations.
- Shared client components read route state through `context/RouteContext` instead of importing `next/navigation` directly.
- Session token encode/decode logic lives in `lib/auth/sessionCore.js`.
- `next-view-transitions` is no longer imported at runtime. Route transitions are handled by the local `runRouteTransition()` helper and Framer Motion in the Pages shell.

## Global shell

Current App Router layout responsibilities have been mirrored in `components/Layout/PagesShell.jsx`:

- global CSS and fonts are imported by `pages/_app.jsx`
- header, menu, search, cookies, footer
- Lenis provider
- route visual, theme, scroll restoration, and Safari arrow-scroll controllers
- Framer Motion page fade via `AnimatePresence mode="wait"`
- shared site/menu/imprint/search/session data via `lib/pages/shellData.js`

Each migrated page should export:

```js
export const getServerSideProps = withPagesShellProps(async (context) => {
  return {
    props: {
      // route props
    },
  };
});
```

Use `notFound: true` and `redirect` objects instead of App Router `notFound()` / `redirect()`.

## Route migration order

Move low-risk static/data routes first, then dynamic and auth/shop routes:

1. `/about`
2. `/imprint`
3. `/newsletter`
4. `/newsletter/[slug]`
5. `/calendar`, `/calendar-archive`, `/pinea-events`
6. `/archive`
7. `/stories`, `/stories/*/[slug]`
8. `/news`, `/open-calls`
9. `/memberships`, `/print-periodical`, `/editions`
10. `/shop`, `/shop/[slug]`
11. `/profile`
12. `/pinsel`
13. `/`

For each route:

- create the matching file in `src/pages`
- copy the server data-fetching into `getServerSideProps`
- import the matching page component from `src/views`
- run `npm run build`
- verify `/de/...` and `/en/...` still rewrite through `proxy.ts`
- verify page transition, menu close, search close, hash scroll, and localized links

## API routes

Route handlers now live in `src/pages/api/**`.

Conversions:

- `export async function GET/POST/PATCH(request)` becomes a default handler `(req, res)`.
- `request.json()` becomes reading `req.body`.
- `request.formData()` needs a Pages-compatible multipart parser or `bodyParser: false`.
- `NextResponse.json(data, { status })` becomes `res.status(status).json(data)`.
- `NextResponse.redirect(url)` becomes `res.redirect(url)`.
- cookie writes should use `Set-Cookie` headers.

Auth routes to port together:

- `/api/auth/shopify/start`
- `/api/auth/shopify/callback`
- `/api/auth/logout`

Profile upload/submission routes should move after auth is verified under Pages Router.

## Animation and routing checks

The Pages Router can preserve persistent layout state through `_app`, and the route fade is keyed by `router.asPath`.

After structural changes, verify:

- menu enter/exit animation on Safari
- icon blur route classes
- Lenis scroll reset/restoration
- hash navigation and blinking targets
- localized links generated through `AnimationLink`
- same-path hash links do not trigger full page fades
- shop basket query state
- profile auth redirects

## Final removal

After every public route and API route has a Pages equivalent:

- keep locale rewrites in `proxy.ts`
- run a full build and browser pass on `/de`, `/en`, dynamic story routes, shop, profile, and API auth flow
