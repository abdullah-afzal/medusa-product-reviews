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

import { Container, Heading, Toaster, Tabs } from "@medusajs/ui";
import { Star } from "@medusajs/icons";
import { RouteConfig } from "@medusajs/admin";
import { ProTab } from "../../../ui-components/tabs/pro-tab";
import { ReviewsTab } from "../../../ui-components/tabs/reviews-tab";
import { Box, Grid } from "@mui/material";

export const Reviews = () => {
  return (
    <div>
      <div className="fixed right-0 top-0 z-9999 p-6 max-w-[484px]">
        <Toaster />
      </div>

      <Container title="Static Pages">
        <header className="px-xlarge py-large flex justify-between items-center">
          <Heading level="h2" className="font-semibold">
            Reviews
          </Heading>
        </header>
        <main>
        
    <Tabs defaultValue='reviews'>
      <Toaster position="top-right"/>
      <Tabs.List >
        <Tabs.Trigger value='reviews'>Reviews</Tabs.Trigger>
        {process.env.MEDUSA_ADMIN_MEDUSA_DOCUMENTS_HIDE_PRO === undefined && <Grid container justifyContent={'end'}>
            <Tabs.Trigger value='pro' style={ { color: 'purple' }}>Pro version</Tabs.Trigger>
        </Grid>}
      </Tabs.List>
      <Tabs.Content value='reviews'>
        <Box height={20}></Box>
        <ReviewsTab/>
      </Tabs.Content>
      
      {process.env.MEDUSA_ADMIN_PRODUCTS_REVIEWS_HIDE_PRO === undefined && <Tabs.Content value='pro'>
        <Box height={20}></Box>
        <ProTab/>
      </Tabs.Content>}
    </Tabs>
        </main>
      </Container>
    </div>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Reviews",
    icon: () => <Star />,
  },
};

export default Reviews;
