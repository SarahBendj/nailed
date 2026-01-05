import { Body, Controller,  HttpCode,  Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { logoutDto, SignInDto, SignUpDto, SO_SignUpDto } from './dto/sign.user.dto';
import { Public } from 'src/common/decorators/public.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt.guards';

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

 @Post('signup')
 @Public()
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
     @Public()
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



    @UseGuards(JwtAuthGuard)
    @Put('update-password')
    async updatePassword(@Req() request, @Body() body: { email: string, password: string }) {
      const idFromToken = request.user.user_id;  
        const { email, password } = body;
        if (!email || !password) {
            return {
                message: 'Email and new password are required'
            }
        }
        const response = await this.authService.updatePassword(idFromToken, body);
        return {
            message: response
        }

    }   

    @Public()
    @Post('request-password-reset')
    async requestPasswordReset(@Body() body: { email: string }) {
        const { email } = body;
        if (!email) {
            return {
                message: 'Email is required'
            }
        }
        const response = await this.authService.requestPasswordReset(email);
        return {
            message: response.message
        }
    }
    
    @Public()   
    @Put('password-reset')
    async passwordForgotten(@Body() body: { email: string, otp: string, password: string }) {
        const { email, otp, password } = body;
        if (!email || !otp || !password) {
            return {
                message: 'Email, OTP and new password are required'
            }
        }
        const response = await this.authService.passwordForgotten(email, otp, password);
        if (response && response.message) { 
        return {
            message: response.message
        }



    }
}
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(200) 
    async logout(@Req() request ) {
        const userFromToken = request.user;
        console.log('User from token:', userFromToken);
        if (!userFromToken) {
            return {
                message: 'Token is required'
            }
        }
        const user = await this.authService.logout(userFromToken)
        
        if (!user) {
            return {
                message: 'Invalid token'
            }
        }
        return {
            message: 'User logged out successfully'
        }
    }
    
    
    //**SALON AREA */

    @Post('so/signup')
    @Public()
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
   


   


   
}

 