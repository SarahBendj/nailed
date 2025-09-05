import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { Review } from 'src/models/review.model';
import { CreateReviewDto } from './dto/review.dto';
import { averageRate } from './utils/rating.calculate';
import { Salon } from 'src/models/salon.model';

@Injectable()
export class ReviewService {

    async getReviews(id : number) : Promise<any[]> {
        if(!id){
            throw new BadRequestException('MISSING_ID')
        }
        const reviews = await Review.findBySalonId(Number(id))
        return reviews;
    }
    


    async createAReview(data: CreateReviewDto) {
    if (!data) {
        throw new BadRequestException('MISSING_DATA');
    }

    const savedReview = await Review.Create(data);
    console.log(savedReview)

    if (!savedReview) {
        throw new BadRequestException('FAILED_TO_CREATE_REVIEW');
    }

    // * UPDATE THE SALON'S RATING
    const allSalonReviews = await this.getReviews(data.salon_id);
    console.log(allSalonReviews)
    const ratings: number[] = allSalonReviews.map((e) => e.rating);

    if (ratings.length > 0) {
        const avg = averageRate(ratings);
        await Salon.Update(data.salon_id, { rating: Number(avg) });
    }

    return savedReview;
    }

  
    
}
