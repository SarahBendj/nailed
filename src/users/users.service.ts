import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/models/user.model';

@Injectable()
export class UsersService {

    async showAll(){

        try {
            const users = await User.findAll()
            if(!users){
                return new NotFoundException()
            }
            return users 
            
        } catch (error) {

            throw new BadRequestException(error.message ||'ERROR')
            
        }

    }

    
}
 