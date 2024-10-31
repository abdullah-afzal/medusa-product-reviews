/*
 * Copyright 2024 [abdullah-afzal](https://github.com/abdullah-afzal)
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import wrapHandler from "@medusajs/medusa/dist/api/middlewares/await-middleware";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { Request, Response } from "express";
import ProductReviewService from "../../services/product-review";
import { omit } from "lodash";
import {
  CreateProductReviewReq,
  StoreGetProductReviewStatsParams,
  StoreGetProductReviewsParams,
  UpdateProductReviewReq,
  UpdateProductReviewReplyReq,
  AdminGetProductReviewByOrderParams,
} from "../../validators";
import { MedusaError } from "medusa-core-utils";
import { Customer, CustomerService, OrderService, Selector } from "@medusajs/medusa";
import { RouteConfig } from "..";
import { ProductReview } from "../../models";

export const routes: RouteConfig[] = [
  {
    requiredAuth: false,
    path: "/store/product-reviews",
    method: "get",
    handlers: [wrapHandler(listProductReviews)],
  },
  {
    requiredAuth: false,
    path: "/store/product-reviews/stats",
    method: "get",
    handlers: [wrapHandler(productReviewStats)],
  },
  {
    requiredAuth: true,
    path: "/store/product-reviews",
    method: "post",
    handlers: [wrapHandler(createProductReview)],
  },
  {
    requiredAuth: true,
    path: "/store/product-reviews/:product_review_id",
    method: "post",
    handlers: [wrapHandler(updateProductReview)],
  },

  // Admin API's
  {
    requiredAuth: true,
    path: "/admin/product-reviews/stats",
    method: "get",
    handlers: [wrapHandler(productReviewStats)],
  },
  
  {
    requiredAuth: true,
    path: "/admin/product-reviews",
    method: "get",
    handlers: [wrapHandler(listProductReviews)],
  },
  {
    requiredAuth: true,
    path: "/admin/product-reviews/:product_review_id",
    method: "post",
    handlers: [wrapHandler(updateProductReviewReply)],
  },
  {
    requiredAuth: true,
    path: "/admin/product-reviews/:id",
    method: "delete",
    handlers: [wrapHandler(deleteProductReview)],
  },
];

export const defaultProductReviewRelations = ["images", "customer", "order", "product"];

async function _validatedCustomer(req: Request): Promise<Customer> {
  const customerService = req.scope.resolve<CustomerService>("customerService");

  if (req.user?.customer_id) {
    const customer = await customerService.retrieve(req.user.customer_id, {
      relations: ["orders", "orders.items.variant"],
    });
    const orderExists = customer.orders.some((order) => {
      if (order.id === req.body.order_id) {
        const productExists = order.items.some(
          (item) => item.variant.product_id === req.body.product_id
        );
        return productExists;
      }
      return null;
    });
    return orderExists ? customer : null;
  }

  return null;
}

async function createProductReview(req: Request, res: Response) {
  const productReviewService = req.scope.resolve<ProductReviewService>("productReviewService");

  const validated = await validator(CreateProductReviewReq, req.body);

  const customer = await _validatedCustomer(req);

  if (!customer) throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "No customer found for request");

  const review = await productReviewService.create({
    ...validated,
    customer_id: customer.id,
  });

  res.json({ review });
}

async function listProductReviews(req: Request, res: Response) {
  const productReviewService = req.scope.resolve<ProductReviewService>("productReviewService");
  const orderService = req.scope.resolve<OrderService>("orderService");

  const validated = await validator(StoreGetProductReviewsParams, req.query);
  let filter = validated;

  if (validated.order_id) {
    const order = await orderService.retrieve(validated.order_id, {
      relations: ["items", "items.variant", "items.variant.product"],
    });

    if (!order) throw new MedusaError(MedusaError.Types.INVALID_DATA, "No reviews found matching order");

    filter.product_id = order?.items.map((item) => item.variant.product_id);
    filter.customer_id = order?.customer_id;
    delete filter.order_id;
  }

  const selector: Omit<StoreGetProductReviewsParams, "fields" | "expand" | "offset" | "limit"> = omit(
    validated,
    "fields",
    "expand",
    "offset",
    "limit"
  );

  const [reviews, count] = await productReviewService.listAndCount(
    {
      ...(selector as Selector<ProductReview>),
    },
    {
      order: { updated_at: "DESC" },
      skip: validated.offset,
      take: validated.limit,
      select: validated.fields ? (validated.fields.split(",") as (keyof ProductReview)[]) : undefined,
      relations: validated.expand ? [...new Set(validated.expand.split(","))] : defaultProductReviewRelations,
    }
  );

  res.status(200).json({ reviews, count });
}

async function productReviewStats(req: Request, res: Response) {
  const productReviewService = req.scope.resolve<ProductReviewService>("productReviewService");

  const validated = await validator(StoreGetProductReviewStatsParams, req.query);

  const stats = await productReviewService.stats(validated);

  res.status(200).json({ stats });
}

async function productReviewByOrder(req: Request, res: Response) {
  const productReviewService = req.scope.resolve<ProductReviewService>("productReviewService");

  const validated = await validator(AdminGetProductReviewByOrderParams, req.query);

  const reviews = await productReviewService.retrieveByOrderId(validated,{ relations: defaultProductReviewRelations});

  res.status(200).json({ reviews });
}

async function updateProductReview(req: Request, res: Response) {
  const productReviewService = req.scope.resolve<ProductReviewService>("productReviewService");

  const validated = await validator(UpdateProductReviewReq, req.body);

  const customer = await _validatedCustomer(req);

  if (!customer) throw new MedusaError(MedusaError.Types.INVALID_DATA, "No customer found for request");

  const currentReview = await productReviewService.retrieve(validated.id);

  if (!currentReview || currentReview.customer_id !== customer.id)
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Review does not exist or does not belong to customer");

  const review = await productReviewService.update(validated);

  res.json({ review });
}

async function updateProductReviewReply(req: Request, res: Response) {
  const productReviewService = req.scope.resolve<ProductReviewService>("productReviewService");

  const validated = await validator(UpdateProductReviewReplyReq, req.body);

  const review = await productReviewService.updateReply(validated);

  res.json({ review });
}

async function deleteProductReview(req: Request, res: Response) {
  const reviewService = req.scope.resolve<ProductReviewService>("productReviewService");

  const { id } = req.params;

  const review = await reviewService.retrieve(id);

  if (!review) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Could not find review");

  await reviewService.delete(id);

  res.status(200).json({ success: true });
}
