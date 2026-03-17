// r2.service.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { r2Client } from "./r2.client";



@Injectable()
export class R2Service {
  /**
   * Upload a file to R2 and return its public URL
   */
  async uploadFiles(
    files: Express.Multer.File[],
    folder: 'hall',
    hallId: string
  ): Promise<string[]> {

    if (!files || files.length === 0) {
      throw new BadRequestException('At least 1 image is required');
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum 10 images allowed');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    const uploadPromises = files.map(async (file) => {
      if (!file.buffer) {
        throw new BadRequestException('Invalid file buffer');
      }

      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Unsupported file type: ${file.mimetype}`
        );
      }

      const ext = file.originalname.split('.').pop();
      const key = `${folder}/${hallId}/${randomUUID()}.${ext}`;

      await r2Client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return key;
    });

    return Promise.all(uploadPromises);
  }



  async getFileUrl(key: string): Promise<string> {
    return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;
  }

  async getSignedUrl(key: string, expiresInSeconds = 60 * 10): Promise<string> {
    return getSignedUrl(
      r2Client,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      }),
      { expiresIn: expiresInSeconds },
    );
  }

   async deleteFile(key: string): Promise<void> {
    const res =await r2Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      }),
    );
    console.log(res)
  }
}