# medusa-product-reviews
<p align="center">
  <img src="https://static.vecteezy.com/system/resources/previews/019/859/726/original/yellow-five-stars-quality-rating-icons-5-stars-icon-five-star-sign-rating-symbol-transparent-background-illustration-png.png" alt="Medusa-extender logo" width="500" height="auto" />
</p>

[Documentation](https://github.com/abdullah-afzal/medusa-product-reviews/blob/main/README.md)

If you are not familiar with Medusa, you can learn more on [the project web site](https://www.medusajs.com/).

<h2>
  Note: This plugin will be migrated to Medusa v2, when v2 will reach production readiness.
</h2>

## What is it?
A plugin that enables customer product reviews for your Medusa store.

## How to install?

1. Install the package with `yarn add medusa-product-reviews` or `npm i medusa-product-reviews`
2. In `medusa-config.js`, add the plugin to the `plugins` array and set `enableUI`

```js
const plugins = [
  // ... other plugins
  {
    resolve: `medusa-product-reviews`,
    options: {
      enableUI: true
    }
  }
]
```
3. Run migrations, e.g. `npx medusa migrations run` (see: https://docs.medusajs.com/development/entities/migrations/overview) as plugin uses new tables.

4. Start project

  - After installation of a plugin, you will see new option on the sidebar named `Reviews`.
  - You can check reviews for each product in single product details page
  - You can check reviews for order on order details page


## API Endpoints

#### **Store API Endpoints**

1. **`GET /store/product-reviews`**
   - **Description**: Retrieves a list of product reviews based on the provided query parameters.
   - **Query Parameters**:
     - `order_id`: (Optional) Filters reviews by a specific order.
     - `product_id`: (Optional) Filters reviews by a specific product.
     - `customer_id`: (Optional) Filters reviews by a specific customer.
     - `rating`: (Optional) Filters reviews by a specific rating.
     - `limit`: (Optional) Number of reviews to return.
     - `offset`: (Optional) Number of reviews to skip before starting to return results.
   - **Response**: Returns a JSON object containing an array of review objects and the total count.
   - **Sample Response**:
     ```json
     {
       "reviews": [
         {
           "id": "string",
           "product_id": "string",
           "customer_id": "string",
           "order_id": "string",
           "rating": 5,
           "content": "Great product!",
           "images": ["image1.jpg", "image2.jpg"],
           "created_at": "2023-08-24T12:34:56.789Z",
           "updated_at": "2023-08-24T12:34:56.789Z"
         }
       ],
       "count": 1
     }
     ```

2. **`GET /store/product-reviews/stats`**
   - **Description**: Retrieves statistics for product reviews, including average rating and distribution by rating.
   - **Query Parameters**:
     - `product_id`: (Required) The product ID for which to retrieve statistics.
   - **Response**: Returns a JSON object containing review statistics.
   - **Sample Response**:
     ```json
     {
       "stats": {
         "product_id": "string",
         "average": 4.5,
         "count": 10,
         "by_rating": [
           { "rating": 5, "count": 6 },
           { "rating": 4, "count": 3 },
           { "rating": 3, "count": 1 }
         ]
       }
     }
     ```

3. **`POST /store/product-reviews`**
   - **Description**: Creates a new product review.
   - **Request Body**:
     - `product_id`: (Required) The ID of the product being reviewed.
     - `order_id`: (Required) The ID of the order associated with the review.
     - `rating`: (Required) The rating given to the product.
     - `content`: (Optional) The content of the review.
     - `images`: (Optional) An array of image URLs or files associated with the review.
   - **Response**: Returns a JSON object containing the newly created review.
   - **Sample Response**:
     ```json
     {
       "review": {
         "id": "string",
         "product_id": "string",
         "customer_id": "string",
         "order_id": "string",
         "rating": 5,
         "content": "Great product!",
         "images": ["image1.jpg", "image2.jpg"],
         "created_at": "2023-08-24T12:34:56.789Z",
         "updated_at": "2023-08-24T12:34:56.789Z"
       }
     }
     ```

4. **`POST /store/product-reviews/:product_review_id`**
   - **Description**: Updates an existing product review by ID.
   - **Request Body**:
     - `product_id`: (Required) The ID of the product being reviewed.
     - `order_id`: (Required) The ID of the order associated with the review.
     - `rating`: (Required) The rating given to the product.
     - `content`: (Optional) The updated content of the review.
     - `images`: (Optional) An array of updated image URLs or files associated with the review.
   - **Response**: Returns a JSON object containing the updated review.
   - **Sample Response**:
     ```json
     {
       "review": {
         "id": "string",
         "product_id": "string",
         "customer_id": "string",
         "order_id": "string",
         "rating": 5,
         "content": "Updated review content.",
         "images": ["image1.jpg", "image2.jpg"],
         "created_at": "2023-08-24T12:34:56.789Z",
         "updated_at": "2023-08-24T12:34:56.789Z"
       }
     }
     ```

#### **Admin API Endpoints**

1. **`GET /admin/product-reviews/stats`**
   - **Description**: Retrieves statistics for product reviews, including average rating and distribution by rating.
   - **Query Parameters**:
     - `product_id`: (Required) The product ID for which to retrieve statistics.
   - **Response**: Returns a JSON object containing review statistics (same format as store endpoint).


3. **`GET /admin/product-reviews`**
   - **Description**: Retrieves a list of product reviews based on the provided query parameters.
   - **Query Parameters**: Same as the `GET /store/product-reviews` endpoint.
   - **Response**: Returns a JSON object containing an array of review objects and the total count.

4. **`POST /admin/product-reviews/:product_review_id`**
   - **Description**: Updates the reply to an existing product review by ID.
   - **Request Body**:
     - `reply`: (Required) The updated reply to the review.
   - **Response**: Returns a JSON object containing the updated review with the new reply.

5. **`DELETE /admin/product-reviews/:id`**
   - **Description**: Deletes an existing product review by ID.
   - **Response**: Returns a JSON object indicating success.
   - **Sample Response**:
     ```json
     {
       "success": true
     }
     ```

### Objects

- **Product Review**:
  ```json
  {
    "id": "string",
    "product_id": "string",
    "customer_id": "string",
    "order_id": "string",
    "rating": 5,
    "content": "Great product!",
    "reply": "Thank you for your feedback!",
    "images": ["image1.jpg", "image2.jpg"],
    "created_at": "2023-08-24T12:34:56.789Z",
    "updated_at": "2023-08-24T12:34:56.789Z",
    "deleted_at": null
  }
  ```

  ## Proposals, bugs, improvements

If you have an idea, what could be the next highest priority functionality, do not hesistate raise issue here: [Github issues](https://github.com/abdullah-afzal/medusa-product-reviews/issues)

## License

MIT

## Pro version

The Pro version of medusa-documents expands on the features of the free version with more advanced capabilities such as:
- option to show/hide reviews
- delete unwanted reviews
- and a lot more.

The Pro version is available under commercial licence - contact [abdullah-afzal](https://github.com/abdullah-afzal) for more information.

### Hide Pro version tab

We show what advanced features we offer in "Pro version" tab. We try to keep it non-intruisive, but if you feel it differently, you can always hide this tab by setting following environment variable:
`MEDUSA_ADMIN_PRODUCTS_REVIEWS_HIDE_PRO=true`

After restarting your admin application, you shall have this tab hidden.

---

© 2024 [abdullah-afzal](https://github.com/abdullah-afzal)

---