## Problem Statement

The project currently presents its product inventory interface at the root URL, so customers have no public storefront and the admin interface has no access control. The team needs to expose the product catalogue as a customer-facing webshop while keeping inventory management under `/admin` and restricting that area to authorized users.

## Solution

Make `/` the public webshop and move the existing inventory management experience under `/admin`. Customers can browse and search the catalogue, inspect product details and use the cart overview described by the project PRD. Admin requests are checked for a valid session and admin authorization on every request. Use nextAuth as authentication provider/library.

## Examples

1. As a customer, I want to open the root URL and see a public product catalogue, so that I can browse the shop without an admin account.
2. As an unauthenticated visitor, I want requests to `/admin` and its nested pages to take me to login, so that administrative screens are not publicly accessible.
3. As an authenticated non-admin user, I want admin access to be denied, so that having an account alone does not grant inventory privileges.
4. As an authorized admin, I want to sign in and access `/admin`, so that I can manage inventory.
5. As an authorized admin, I want the existing product create, edit and delete workflows to remain available under `/admin`, so that I can maintain the catalogue.
6. As an admin, I want authorization checked on every request to `/admin`, including nested pages and server operations, so that expired or insufficient sessions cannot continue using protected functionality.
7. As an admin, I want to sign out and have subsequent admin requests denied until I sign in again, so that access ends when my session ends.
8. As a customer, I want public catalogue pages to remain accessible without signing in, so that browsing does not require an account.

## Implementation Decisions

- Keep one Next.js App Router application. Use route groups for public storefront organization and a real `/admin` route segment for the admin area; route groups do not affect public URLs.
- Make the public storefront the root route. Relocate the existing inventory dashboard and product management experience under `/admin`.
- Use a distinct storefront layout and admin layout while retaining a shared root layout where practical.
- Use the Next.js 16 `proxy.ts` convention to perform an early session check for each request matched under `/admin`, including nested admin URLs. Redirect unauthenticated requests to login and deny authenticated users without the admin role.
- Do not treat Proxy as the only authorization boundary. Verify session and admin role in the admin server layout, data access functions, Server Actions and Route Handlers before protected data is read or changed.
- Integrate an established authentication/session library or provider rather than inventing password and session handling. Record the choice in an ADR.
- Give admin privileges through an explicit role/allowlist managed on the server. Do not provide public self-service admin registration.
- Keep the current product and category service as the initial catalogue data source. The current JSON Server and local JSON file are mock infrastructure, not a production source of truth for purchases or customer records.

## Testing Decisions

- Prefer request-level end-to-end tests of observable behavior over tests coupled to file names or internal helper implementation.
- Use one high-level seam: exercise public and `/admin` URLs as a visitor, a signed-in non-admin, and an authorized admin. Verify redirects/denials, successful access, and denial after logout or session expiry.
- Through the same seam, attempt protected product mutations with missing, invalid, and non-admin sessions; verify no mutation occurs. Verify admin sessions can complete the existing product workflows.
- Verify public catalogue, product detail, search/filter URL state, pagination, and not-found behavior remain usable without authentication.
- The repository currently contains no automated test framework or test files. Add the smallest suitable request/browser-level test setup when implementation begins; there is no existing test prior art to extend.

## Out of Scope

- Customer registration, customer login, and customer account pages.
- Payment processing, real checkout, order persistence, shipping and tax calculation.
- Replacing JSON Server with a production database as part of this feature.
- Changes to the inventory management workflows beyond moving them under `/admin` and enforcing authorization.
- Supporting multiple admin roles or fine-grained per-action permissions beyond the admin role.

## Further Notes

- The project's PRD already describes the customer-facing catalogue requirements and cart overview for Phase 2; this spec ties that storefront to the access-control conversation and clarifies the route split.
- The project uses Next.js 16.2.10. In Next.js 16, the request interception convention is `proxy.ts`; `middleware.ts` is deprecated.
- The repository's `node_modules` is absent in the current workspace, so the mandated installed Next.js documentation could not be read locally. Current official Next.js documentation was consulted for route groups, Proxy, and authentication guidance.
