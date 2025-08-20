import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto, SO_SignUpDto , updatePasswordDto } from './dto/sign.user.dto';
import { Token } from 'src/models/token.model';
import { Salon } from 'src/models/salon.model';
import { DB } from 'src/database/db';
import { NewUserMailing } from 'utility/mailing/newUser.client';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly newUserMailing: NewUserMailing,
  @Inject('REDIS_CLIENT') private readonly redisClient: Redis,) {}

  async validateUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      return null;
    }

    const user = await User.findbyEmail(email);
    if (!user) {
      return null;
    }

    const isHashed = user.password.startsWith('$2b$'); 

    // Si le mot de passe est encore en clair (ancien compte ?)
    if (!isHashed) {
      if (password === user.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.Update(user.id , { password: hashedPassword });
        return { id: user.id, email: user.email };
      } else {
        return new BadRequestException(' Email or password invalid');
      }
    }

    // Cas normal : comparer avec bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return { id: user.id, email: user.email };
    }

    return new BadRequestException(' Email or password invalid');;
  }

  async login(user: any) {

    const payload = { sub: user.id, email: user.email };
    const oldToken = await Token.findByConsumerId(user.id);
    if(oldToken && oldToken.id){
      await Token.Delete(oldToken.id);
    }
    const access_token = this.jwtService.sign(payload);
    await Token.Create( {consumer_id : user.id, token: access_token ,expires_at :'2025-05-07'} );
    return {
      access_token: access_token
    };
  }
  async register(user: SignUpDto) {
    const existingUser = await User.findbyEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
   
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await User.Create({ ...user, password: hashedPassword });

    //*NOTIFY USER BY EMAIL
    const EMAILED = await this.newUserMailing.sendToClient(newUser.email, newUser.name);
    if (!EMAILED) {
      throw new BadRequestException('Failed to send welcome email');
    }
    return `User created successfully with ID: ${newUser.name}`;
  }

  async consentToTerms(email: string , otp : string): Promise<string> {
    const user = await User.findbyEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    //*check in redis
        // 2. Check OTP from Redis
    const storedOtp = await this.redisClient.get(`otp:${email}`);
     console.log(storedOtp , otp)
    if (!storedOtp) {
      throw new BadRequestException('OTP expired or not found');
     
    }

    if (storedOtp !== otp) {
            throw new BadRequestException('Invalid OTP');
    }

    // 3. OTP valid → mark user verified & save consent
    await User.Update(user.id ,{ consent : true });

    await this.redisClient.del(`otp:${email}`);

    return 'User verified and consent recorded successfully';
  }


  async updatePassword(id: number, data: updatePasswordDto) {
    const existingUser = await User.findbyEmail(data.email);
    if (!existingUser ) {
      throw new BadRequestException('User does not exist');  
    }
    const NewPwd = await bcrypt.hash(data.password, 10);

    const updatedUser = await User.Update(id, {
      password: NewPwd,
    });
    if (!updatedUser) {
      throw new BadRequestException('Failed to update password');
    }

    if (updatedUser) {
      return {
        message: 'Password updated successfully',
        user: updatedUser,
      };
    }
  }

  async logout(used_token: string) {
    
    const token = await Token.findByConsumerId(used_token);

    console.log('token', token);
    if (token && token.id) {
      await Token.Delete(token.id);
      return { message: 'Logout successful' };
     
    }
 
     throw new BadRequestException('Token not found');

    }

   async registerforSalonOwner(salonOwner: SO_SignUpDto) {
  console.log('salonOwner', salonOwner);

  const existingUser = await User.findbyEmail(salonOwner.email);
  if (existingUser) {
    throw new BadRequestException('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(salonOwner.password, 10);

  await DB.query('BEGIN');
  try {

  const newUser : any = await User.Create({
    name: salonOwner.name,
    email: salonOwner.email,
    role: salonOwner.role,
    password: hashedPassword,
  });

  const newSalon : any = await Salon.Create({
    name : salonOwner.salon_name,
    address: salonOwner.address,
    latitude: salonOwner.latitude,
    longitude: salonOwner.longitude,
    phone: salonOwner.phone,
    description: salonOwner.description,
    user_id: newUser.id,
  });
   await DB.query('COMMIT');
   return {
    message: 'Salon owner registered successfully',
    userId: newUser.id,
    salonId: newSalon.id,
  };
  } catch (error) {
    await DB.query('ROLLBACK');
    console.error('Error during transaction:', error);
    throw new BadRequestException('Transaction failed');
  } finally {
    await DB.query('ROLLBACK');
  }

  
}

  }

