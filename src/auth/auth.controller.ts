import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: unknown): Promise<void> {
    // return this.authService.signUp(authCredentialsDto);
    return;
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: unknown,
  ): Promise<{ accessToken: string }> {
    // return this.authService.signIn(authCredentialsDto);
    return;
  }
}
