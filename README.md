# Sales Engineer
##### Technical Test
___

#### Language
Node.js and Typescript

#### Script Requirements
1. Pull all past Shopify Order data from 2016 (hint, it’s not many).
    - I decided to use Shopify's Order Api params to set contraints with: `processed_at_min` and `processed_at_max`. These properties are most representative of when the order became complete.
    - Other params I set included:
        - `limit` to increase number of orders retrieved.
        - `financial_status` to `paid` to only retrieve completed orders.
2. For each order, Klaviyo wants two event types: “Placed Order” and “Ordered Product”.
    - Iterating over each order I would queue a **"Placed Order"** Event and diving into each order's line item I would also push an **"Ordered Product"** Event.
        - ie. an order has two line items, then 3 events would be queued.

#### Installattion
###### Prerequisites:
* **Node** I used: `v10.15.3`

##### Setup:
* `git clone`
* `cd repo`
* `npm install`

###### Env:
* `cp .env.sample ./.env`
* add api keys and passwords here.

##### Commands:
* **Dev** `npm run dev` *watches ./src directory and compiles as you work*
* **Start** `npm run start` *builds and fires script once*