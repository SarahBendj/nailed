import { Injectable, BadRequestException, StreamableFile } from '@nestjs/common';
// import { File as MulterFile } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Salon } from 'src/models/salon.model';
import { BUCKETS } from './rules/vocabulary';

@Injectable()
export class ImagesService {
  private readonly bucketPath = path.resolve(__dirname, './bucket');

  async uploadImageforService(
    id: string,
    folder: string,
    images: Express.Multer.File[], 
  ): Promise<{ message: string; paths: string[] }> {
    console.log('Uploading images for service:', id, folder);

    // Validate folder name
    if (!Object.values(BUCKETS).includes(folder)) {
      throw new BadRequestException(`Invalid folder name: ${folder}`);
    }

    if (!images || images.length === 0) {
      throw new BadRequestException('At least one image must be provided.');
    }

    // Prepare target folder path
    const targetPath = path.join(this.bucketPath, folder, id);
    fs.mkdirSync(targetPath, { recursive: true });

    // Read existing files
    const existingFiles = fs.readdirSync(targetPath);
    const totalFiles = existingFiles.length + images.length;

    if (existingFiles.length >= 8) {
      throw new BadRequestException('You already have 8 images. Cannot upload more.');
    }

    // Only take enough images to reach the limit of 8
    let imagesToUpload = images;
    if (totalFiles > 8) {
      const remainingSlots = 8 - existingFiles.length;
      imagesToUpload = images.slice(0, remainingSlots);
      console.log(`Too many images uploaded. Only uploading the first ${remainingSlots} images.`);
    }

    console.log('Existing files count:', existingFiles.length);

    // Determine next file index
    const indexes = existingFiles
      .map((file) => {
        const match = file.match(/^index_(\d+)\.jpg$/);
        return match ? parseInt(match[1], 10) : -1;
      })
      .filter((n) => n >= 0);
    let nextIndex = indexes.length > 0 ? Math.max(...indexes) + 1 : 0;

    const savedPaths: string[] = [];

    // Save images
    for (const file of imagesToUpload) {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('All files must be images.');
      }

      const fileName = `index_${nextIndex}.jpg`;
      const filePath = path.join(targetPath, fileName);
      fs.writeFileSync(filePath, file.buffer);
      savedPaths.push(`/bucket/${folder}/${id}/${fileName}`);
      nextIndex++;
    }

    // Optional database update for "salons"
    if (folder === 'salons') {
      const salon = await Salon.findOne(Number(id));
      if (!salon) throw new BadRequestException('Salon not found');

      if (!salon.image_folder) {
        await Salon.Update(Number(id), { image_folder: `bucket/${folder}/${id}` });
        console.log('Salon updated with image folder');
      }
    }

    return {
      message: 'Images uploaded successfully',
      paths: savedPaths,
    };
  }

  

  async retriveImages(folder: string, id: string): Promise<{ urls: string[] }> {
  if (!id || !folder) {
    // Retourner un objet vide si les paramètres sont manquants
    return { urls: [] };
  }

  const folderPath = path.join(this.bucketPath, folder, id);

  if (!fs.existsSync(folderPath)) {
    // Retourner un objet vide si le dossier n'existe pas
    return { urls: [] };
  }

  const files = fs.readdirSync(folderPath);

  const urls = files.map((file) => `/bucket/${folder}/${id}/${file}`);

  return { urls };
}

 async retrieveImageByName(folder: string, id: string, fileName: string): Promise<StreamableFile> {
    if (!id || !folder || !fileName) throw new BadRequestException('Missing folder, id or fileName');

    const filePath = path.join(this.bucketPath, folder, id, fileName);
    console.log('File path:', filePath);
    if (!fs.existsSync(filePath)) throw new BadRequestException('Image not found');

    const fileStream = fs.createReadStream(filePath);
    return new StreamableFile(fileStream);
  }

}


//     async uploadImages(images: Express.Multer.File[]): Promise<string[]> {
//         if (!images || images.length < 2 || images.length > 6) {
//             throw new BadRequestException('You must upload between 2 and 6 images.');
//         }


//         const uploadResults = images.map((image) => {
//             if (!image) {
//                 throw new BadRequestException('One of the files is invalid.');
//             }
//             return `Image ${image.originalname} uploaded successfully.`;
//         });

//         return uploadResults;
//     }
// }

