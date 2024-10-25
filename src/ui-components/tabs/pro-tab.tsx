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

import { Container, Heading, Text } from "@medusajs/ui"
import { Grid, Link } from "@mui/material";

const HEIGHT = 330;

export const ProTab = () => {
  return (
    <Grid container spacing={2} justifyContent={"center"} >
      <Grid container justifyContent={"center"} marginTop={6}>
        <Grid item>
          <Heading level='h1' style={ { color: 'purple'}}>
            Manage Reviews on the next level
          </Heading>
        </Grid>
      </Grid>
      <Grid container justifyContent={"center"} marginTop={1} spacing={5}>
        <Grid item xs={3} md={3} xl={3}>
          <Container style={ { borderColor: 'purple', borderWidth: 1, height: HEIGHT}}>
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level='h1'>Basic</Heading>
              </Grid>
              <Grid item>
                <ul style={ { listStyleType: 'circle'}}>
                  <li>
                    <Text>Admin controle to show or hide reviews</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Admin Controle to delete unwanted reviews </Text>
                  </li>
                </ul>
                </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={3} md={3} xl={3}>
          <Container style={ { borderColor: 'purple', borderWidth: 1, height: HEIGHT}}>
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level='h1'>Professional support</Heading>
              </Grid>
              <Grid item>
                <ul style={ { listStyleType: 'circle'}}>
                  <li>
                    <Text>Priority bug resolution</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Dedicated channel for evaluating your feature requests</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Long-term cooperation, including support for other plugins</Text>
                  </li>
                </ul>
                </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'column'} alignContent={"center"} marginTop={6}>
        <Grid container direction={'row'} justifyContent={'center'} columnSpacing={1}>
          <Grid item>
            <Heading level='h1' color="purple">
              Contact:
            </Heading>
          </Grid>
          <Grid item>
            <Link href="https://github.com/abdullah-afzal">
              <Heading level='h1' color="purple">
                abdullah-afzal
              </Heading>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'column'} alignContent={"center"} marginTop={6}>
        <Grid container direction={'row'} justifyContent={'center'} columnSpacing={1}>
          <Grid item>
            <Text>
              You can hide this tab if you feel it is intruisive. See: 
            </Text>
          </Grid>
          <Grid item>
            <Link href="https://github.com/abdullah-afzal/medusa-product-reviews?tab=readme-ov-file#hide-pro-version-tab">
              <Text>
                How to hide this tab?
              </Text>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}