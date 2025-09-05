import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review.dto';


@Controller('review')
export class ReviewController {
    constructor( private readonly reviewService : ReviewService) {}

    @Post()
    async commentOrRate(@Body() data :CreateReviewDto ){
        const result = await this.reviewService.createAReview(data);
        return result

    }
 
    @Get('salon/:id')
    async displayReviewsBySalon(@Param('id') id : string){
        const result = await this.reviewService.getReviews(Number(id))
        return result;

    }

        
    
}
