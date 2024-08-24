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

export interface CreateProductReviewInput {
  product_id?: string;
  customer_id?: string;
  order_id?: string; 
  rating: number;
  content?: string;
  images?: (Express.Multer.File | string)[];
}

export interface UpdateProductReviewInput {
  product_id: string;
  product_variant_id?: string;
  customer_id?: string;
  order_id: string;
  rating: number;
  content?: string;
  images?: (Express.Multer.File | string)[];
}

export interface ProductReviewStats {
  product_id: string;
  average: number;
  count: number;
  by_rating: {
    rating: number;
    count: number;
  }[];
}
