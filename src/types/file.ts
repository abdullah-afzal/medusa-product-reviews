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

import { Readable } from "typeorm/platform/PlatformTools";

export declare class NodeOnDiskFile implements File {
  private filepath;
  type: string;
  private slicer?;
  name: string;
  lastModified: number;
  webkitRelativePath: string;
  constructor(
    filepath: string,
    type: string,
    slicer?:
      | {
          start: number;
          end: number;
        }
      | undefined
  );
  get size(): number;
  slice(start?: number, end?: number, type?: string): Blob;
  arrayBuffer(): Promise<ArrayBuffer>;
  stream(): ReadableStream<any>;
  stream(): NodeJS.ReadableStream;
  text(): Promise<string>;
  get [Symbol.toStringTag](): string;
  remove(): Promise<void>;
  getFilePath(): string;
}

export async function convertToExpressMulterFile(file: any): Promise<Express.Multer.File> {
  const expressMulterFile = {
    fieldname: "file",
    originalname: file.name,
    encoding: "7bit",
    mimetype: file.type,
    size: file.size,
    destination: "",
    filename: file.name,
    path: file.filepath as string,
    stream: null as unknown as Readable,
    buffer: null as unknown as Buffer,
  };

  return expressMulterFile;
}
