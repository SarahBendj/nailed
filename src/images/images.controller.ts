import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';


@Controller('images/:folder/:id')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 8)) 
  upload(
    @UploadedFiles() images: Express.Multer.File[],
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
  return this.imagesService.retriveImages(folder, id);
}

@Get('retrieve/:fileName')
async retrieveByName(@Param('folder') folder: string ,@Param('id') id: string, @Param('fileName') fileName: string, @Res() res) {
    console.log('Retrieving image by name:', folder, id, fileName);
  const streamableFile = await this.imagesService.retrieveImageByName(folder, id, fileName);
   res.setHeader('Content-Type', 'image/webp');
  streamableFile.getStream().pipe(res); 


}
}