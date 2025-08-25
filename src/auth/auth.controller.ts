import { Body, Controller,  Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { logoutDto, SignInDto, SignUpDto, SO_SignUpDto } from './dto/sign.user.dto';
import { NewUserMailing } from 'utility/mailing/newUser.client';
import { Public } from 'src/common/decorators/public.decorators';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('/signin')
    @Public()

    async signup(@Body() body: SignInDto ) {
        const { email, password } = body;
        if (!email || !password) {
            return {
                message: 'Email and password are required'
            }
        }
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            return {
                message: 'Invalid email or password'
            }
        }
        const ExistingUser =await this.authService.login(user);
        if (ExistingUser) {
            return {
                access_token: ExistingUser.access_token,
            }
        }  
     
    }

    @Post('salonowner/signup')
    async salonOwnerRegister(@Body() body: SO_SignUpDto) {
        if (!body) {
            return {
                message: 'all columns are required'
            }
        }
        const response = await this.authService.registerforSalonOwner(body);
        return {
            response
    }
}
    @Post('client/signup')
    async register(@Body() body: SignUpDto) {
        const { email, password, name , role } = body;
        if (!email || !password || !name || !role) {
            return {
                message: 'all columns are required'
            }
        }
        const user = await this.authService.register(body);
        if (!user) {
            return {
                message: 'User already exists'
            }
        }
        return {
            message: 'User created successfully',
            user
        }
    }


    @Post('consent-to-terms') 
        async consentTerms(@Body() body: { email: string, otp: string }) {
            const { email, otp } = body;
            if (!email || !otp) {
                return {
                    message: 'Email and OTP are required'
                }
            }
            const response = await this.authService.consentToTerms(email, otp);
            return {
                message: response
            }
        }
    


    @Post('logout')
    async logout(@Body() body : logoutDto ) {
        if (!body.token) {
            return {
                message: 'Token is required'
            }
        }
        const user = await this.authService.logout(body.token);
        if (!user) {
            return {
                message: 'Invalid token'
            }
        }
    }
}

 