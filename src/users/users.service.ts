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

    async showById(id: number) {
        try {
            const user = await User.findOne(id)
            if(!user){
                return new NotFoundException()
            }
            return user
        } catch (error) {
            throw new BadRequestException(error.message ||'ERROR')
        }       
    }

    async createUser(user: any) {
        try {
            const newUser = await User.Create(user)
            if(!newUser){
                return new NotFoundException()
            }
            return newUser
        } catch (error) {
            throw new BadRequestException(error.message ||'ERROR')
        }
    }
    async updateUser(id: number, user: any) {
        try {
            const existingUser = await User.findOne(id)
            if (!existingUser) {
                return new NotFoundException()
            }
            const updatedUser = await User.Update(id, user)
            if(!updatedUser){
                return new NotFoundException()
            }
            return updatedUser
        } catch (error) {
            throw new BadRequestException(error.message ||'ERROR')
        }  
    }


    async deleteUser(id: number) {
        try {
            const existingUser = await User.findOne(id)
            if (!existingUser) {
                return new NotFoundException()
            }
            const deletedUser = await User.Delete(id)
            if(!deletedUser){
                return new NotFoundException()
            }
            return deletedUser
        } catch (error) {
            throw new BadRequestException(error.message ||'ERROR')
        }  
    }

    
}
 