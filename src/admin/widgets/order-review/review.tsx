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

import type { OrderDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import { useEffect, useState } from "react";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Star, StarSolid } from "@medusajs/icons";
import { Avatar, Button, Container, Heading, Textarea } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";

const QUERY_KEY = ["getReview", { method: "GET" }];

const OrderReviewWidget = ({ order }: OrderDetailsWidgetProps) => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useAdminCustomQuery(
    `product-reviews?order_id=${order.id}`,
    QUERY_KEY
  );
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      setReviews(data?.reviews);
    }
  }, [isLoading, data]);

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
      </div>

      {!isLoading && reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="flex h-full w-full">
            <div
              className="border-ui-border-base w-full max-w-[216px] border-r p-4"
            >
              <img
                src={review.product.thumbnail}
                alt={review.product.title}
                className="rounded-lg cursor-pointer"
                width={120}
                height={120}
                onClick={() => navigate(`/a/products/${review.product.id}`)}
              />
              <Heading
                level="h3"
                className="cursor-pointer mt-2"
                onClick={() => navigate(`/a/products/${review.product.id}`)}
              >
                {review.product.title}
              </Heading>
            </div>
            <div className="flex w-full flex-col gap-y-2 px-8 pb-8 pt-6">
              <Container className="gap-4 mt-3 mr-2">
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
              <Reply 
              review_id={review.id}
              reply={review.reply}
              refetch={refetch}
              />
            </div>
          </div>
        ))
      ) : (
        <div>There are no reviews for this Order</div>
      )}
    </div>
  );
};

function Reply({
  review_id,
  reply,
  refetch,
}: {
  review_id: string;
  reply: string;
  refetch: () => void;
}) {
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [currentReply, setCurrentReply] = useState<string>(reply || "");
  
  const { mutate: updateReply, isLoading: isDeleting } = useAdminCustomPost(
    `product-reviews/${review_id}`, ["update-reply"]
  );

  const handleReplyChange = (value: string) => {
    setCurrentReply(value);
  };

  const handleSaveReply = () => {
    updateReply({id: review_id,reply: currentReply })
    refetch();
    setActiveReply(null);
  };

  const handleCancelReply = () => {
    setCurrentReply(reply || "");
    setActiveReply(null);
  };

  return (
    <Container className="ml-5 bg-gray-200 p-4">
      {activeReply === review_id ? (
        <div className="flex flex-col gap-2">
          <Textarea
            value={currentReply}
            placeholder="Add a reply for this review"
            onChange={(e) => handleReplyChange(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleSaveReply}>Save</Button>
            <Button variant="secondary" onClick={handleCancelReply}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => setActiveReply(review_id)}
        >
          {reply ? reply : "Add a reply"}
        </div>
      )}
    </Container>
  );
}


export const config: WidgetConfig = {
  zone: "order.details.after",
};

export default OrderReviewWidget;
