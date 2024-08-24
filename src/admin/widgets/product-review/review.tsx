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

import type { ProductDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import { useEffect, useState } from "react";
import { useAdminCustomQuery } from "medusa-react";
import { Star, StarSolid, Trash } from "@medusajs/icons";
import {
  Avatar,
  Badge,
  Button,
  Container,
  Drawer,
} from "@medusajs/ui";
import { useNavigate } from "react-router-dom";

const QUERY_KEY = ["getReview", { method: "GET" }];

const ProductReviewWidget = ({
  product,
  notify,
}: ProductDetailsWidgetProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useAdminCustomQuery(
    `product-reviews/stats?product_id[]=${product.id}`,
    QUERY_KEY
  );
  const { data: allReviews, isLoading: allReviewsIsLoading } =
    useAdminCustomQuery(`product-reviews`, [`All_reviews`]);
  const [stats, setStats] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      setStats(data?.stats);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (!allReviewsIsLoading && allReviews) {
      const filtered = allReviews.reviews.filter(
        (review) => review.product_id === product.id
      );
      setFilteredReviews(filtered);
    }
  }, [allReviewsIsLoading, allReviews]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex">
        {Array(fullStars)
          .fill(0)
          .map((_, idx) => (
            <StarSolid key={idx} className="text-yellow-500 mr-2" />
          ))}
        {halfStar && <Star className="text-yellow-500 opacity-50 mr-2" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, idx) => (
            <Star key={idx} className="text-gray-300 mr-2" />
          ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <h1 className="text-grey-90 inter-xlarge-semibold">Reviews</h1>
        <Drawer>
          <Drawer.Trigger>
            <Button variant="transparent" className="border border-gray-300">
              Show All
            </Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              
                All Reviews for <Badge>{product.title}</Badge>
              
            </Drawer.Header>
            <Drawer.Body className="overflow-y-auto">
              {!allReviewsIsLoading &&
                filteredReviews?.map((review) => (
                  <Container key={review.id} className="gap-4 mt-3">
                    <div className="flex justify-between">
                      <div className="flex flex-row items-center gap-3">
                        <Avatar src="" fallback={review.customer.email[0]} />
                        <div
                          className="text-sm text-gray-600 cursor-pointer"
                          onClick={() =>
                            navigate(`/a/customers/${review.customer.id}`)
                          }
                        >
                          {review.customer.email}
                        </div>

                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>                     
                    </div>

                    <div className="mt-2 text-gray-800">{review.content}</div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {review.images &&
                        review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`Review Image ${index + 1}`}
                            className="rounded-lg"
                            width={100}
                            height={100}
                          />
                        ))}
                    </div>
                  </Container>
                ))}
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Close</Button>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </div>

      {!isLoading && stats ? (
        <div>
          <div className="flex items-center gap-2">
            {renderStars(stats[0].average)}
            <span className="text-grey-70 inter-large-regular">
              {stats[0].average} ({stats[0].count} reviews)
            </span>
          </div>
          <div className="mt-4">
            {stats[0].by_rating.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                  <span className="text-grey-70 inter-large-regular">
                    ({count})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default ProductReviewWidget;
