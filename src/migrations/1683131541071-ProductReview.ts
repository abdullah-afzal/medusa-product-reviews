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

import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class productReview1683131541071 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "product_review" (
        "id" character varying NOT NULL, 
        "product_id" character varying NOT NULL, 
        "product_variant_id" character varying,
        "customer_id" character varying NOT NULL,
        "order_id" character varying NOT NULL,
        "rating" integer NOT NULL, 
        "content" character varying NOT NULL,
        "reply" character varying, 
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "deleted_at" TIMESTAMP WITH TIME ZONE )`
    );
    await queryRunner.query(`
      ALTER TABLE "product_review"
      ADD CONSTRAINT "PK_product_review" PRIMARY KEY ("id");

      ALTER TABLE "product_review"
      ADD CONSTRAINT "FK_product_review_product_id" FOREIGN KEY ("product_id")
      REFERENCES "product" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("product_review", true);
  }
}
