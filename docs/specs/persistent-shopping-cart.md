## Problem Statement

Customers need a place to collect products from the product listing and product detail pages. Without a shopping cart that retains its contents across page reloads and sessions, customers risk losing their selections and have no clear summary of quantities and costs.

## Solution

Add a persistent shopping cart where customers can add products from the product listing and detail pages, change quantities, and remove products. A dedicated cart view shows each product's name, unit price, quantity, and subtotal, as well as the cart total. The contents are saved across page reloads and sessions.

## User Stories

1. As a customer preparing a purchase, I want to add and manage products in a persistent shopping cart so that I can see which products I have selected and their combined cost.
2. As a customer, I want to add a product from the product listing or its detail page so that I can collect products wherever I find them.
3. As a customer, I want adding a product that is already in the cart to increase its quantity on the same line so that the same product is not shown on multiple lines.
4. As a customer, I want to increase or decrease a product's quantity and remove it entirely so that the cart reflects what I want.
5. As a customer, I want to see each product's name, unit price, quantity, line subtotal, and the total so that I can review the cart contents and cost.
6. As a customer, I want cart amounts to use the product price and the same price and currency format as the product pages so that prices are consistent.
7. As a customer, I want the cart to be saved across page reloads and sessions so that my selections are still there when I return.
8. As a customer, I want to be told when the cart is empty and be able to return to the products so that I understand where I am and how to continue.
9. As a customer, I must not be able to add a product with no stock or exceed its available stock so that the cart never contains more items than are available.

## Implementation Decisions

- The project's selected extension module is a persistent shopping cart using Zustand.
- Cart contents persist across page reloads and sessions.
- A product appears at most once in the cart; adding it again increases its quantity.
- Quantities can be changed and products can be removed. Line subtotals and the cart total are recalculated when contents change.
- Products can be added from both the product listing and the detail page.
- Stock limits additions and quantities. Products with no stock cannot be added.
- The cart view shows product name, unit price, quantity, line subtotal, and total.
- Prices and currency use the same formatting as on the product pages; this specification does not introduce currency conversion.
- No domain glossary or ADR governing the cart was found in the repository. The PRD identifies Zustand with the persist middleware as the selected module decision.

## Testing Decisions

- Test customer-visible behavior through the flow from the product listing or detail page to the cart view. Verify adding products, increasing the quantity of an existing product, changing and removing quantities, stock limits, the empty state, price calculations, and persistence after reload or return.
- Tests should check outputs and behavior customers can observe, not the Zustand store implementation or internal component details.
- Test boundary: the complete customer flow through the UI, the highest cohesive level for cart behavior.
- The repository has no existing test suite or established test tool for this flow. Choose a test tool when planning implementation; do not tie this specification to a specific tool.

## Out of Scope

- Checkout, order placement, and order confirmation.
- Payment or payment service integration.
- Sign-in, customer accounts, and syncing carts across devices.
- Currency conversion.

## Further Notes

- The PRD describes a dedicated cart view and identifies the persistent shopping cart as the selected extension module.
- The existing product model contains a price and an optional stock quantity. It has no currency property.
- PRD User Story 3 should remain concise: “As a customer preparing a purchase, I want to add and manage products in a persistent shopping cart so that I can see which products I have selected and their combined cost.” The details above belong in this specification.
