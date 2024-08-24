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

import { IFileService, wrapHandler } from "@medusajs/medusa";
import { RouteConfig } from "..";
import { Request, Response } from "express";
import fs from "fs";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export const routes: RouteConfig[] = [
  {
    requiredAuth: false,
    path: "/store/product-reviews/upload",
    method: "post",
    handlers: [upload.array("files"), wrapHandler(uploadImage)],
  },
];

async function uploadImage(req: Request, res: Response) {
  const fileService = req.scope.resolve<IFileService>("fileService");

  const files = Array.isArray(req.files) ? req.files : Object.values(req.files);
  const result = await Promise.all(
    files.map(async (f) => {
      return fileService.upload(f).then((result) => {
        fs.unlinkSync(f.path);
        return result;
      });
    })
  );

  res.status(200).json({ uploads: result });
}

export class IAdminPostUploadsFileReq {
  originalName: string;
  path: string;
}
