import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './dto/sign.user.dto';
import { Token } from 'src/models/token.model';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      return null;
    }

    const user = await User.findbyEmail(email);
    if (!user) {
      return null;
    }

    const isHashed = user.password.startsWith('$2b$'); // bcrypt hash always starts with $2b$ or $2a$

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
    return `User created successfully with ID: ${newUser.name}`;
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
}
