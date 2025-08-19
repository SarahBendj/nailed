import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { File as MulterFile } from 'multer';
import { ImagesService } from './images.service';

@Controller('images/:folder/:id')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 8)) 
  upload(
    @UploadedFiles() images: MulterFile[], 
    @Param('folder') folder: string, 
    @Param('id') id: string
  ) {
      // Check if at least one file is uploaded
  if (!images || images.length === 0) {
    throw new BadRequestException('At least one image must be uploaded.');
  }
    console.log('Uploading images:', folder, id, images.length);
    return this.imagesService.uploadImageforService(id, folder, images);
  }


@Get('retrieve')
retrieve(@Param('folder') folder: string ,@Param('id') id: string) {
    console.log('Retrieving image:', folder, id);
  return this.imagesService.retriveImage(folder, id);
}


}