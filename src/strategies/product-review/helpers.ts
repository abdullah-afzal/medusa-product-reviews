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

import {
  ProductReviewColumnDefinition,
  TBuiltProductReviewImportLine,
  TParsedProductReviewImportRowData,
} from "./types"
import {
  CsvSchema,
  CsvSchemaColumn,
} from "@medusajs/medusa/dist/interfaces/csv-parser"

const productReviewColumnsDefinition: ProductReviewColumnDefinition = {
  PRODUCT_ID: {
    name: "PRODUCT_ID",
    importDescriptor: {
      mapTo: "product.product_id",
      required: false,
    },
  },

  CUSTOMER_ID: {
    name: "CUSTOMER_ID",
    importDescriptor: {
      mapTo: "product.customer_id",
      required: false,
    },
  },

  ORDER_ID: {
    name: "ORDER_ID",
    importDescriptor: {
      mapTo: "product.order_id",
      required: false,
    },
  },

  CONTENT: {
    name: "CONTENT",
    importDescriptor: {
      mapTo: "product.content",
      required: true,
    },
  },

  RATING: {
    name: "RATING",
    importDescriptor: {
      mapTo: "product.rating",
      required: true,
    },
  },

  IMAGE: {
    name: "IMAGE",
    importDescriptor: {
      match: /IMAGE\d+/,
      reducer: (builtLine: any, key, value): TBuiltProductReviewImportLine => {
        builtLine["product_review.images"] =
          builtLine["product_review.images"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        builtLine["product_review.images"].push(value)

        return builtLine
      },
    },
  },
}

export const productReviewImportColumnsDefinition: CsvSchema<
  TParsedProductReviewImportRowData,
  TBuiltProductReviewImportLine
> = {
  columns: Object.entries(productReviewColumnsDefinition)
    .map(([name, def]) => {
      return def.importDescriptor && { name, ...def.importDescriptor }
    })
    .filter(
      (
        v
      ): v is CsvSchemaColumn<
        TParsedProductReviewImportRowData,
        TBuiltProductReviewImportLine
      > => {
        return !!v
      }
    ),
}
