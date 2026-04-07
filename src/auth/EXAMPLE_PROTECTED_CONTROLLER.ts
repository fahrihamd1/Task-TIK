import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * EXAMPLE OF HOW TO USE JWT AUTH GUARD
 * Uncomment to use in your project
 */
@Controller('api/protected')
export class ProtectedExampleController {
  /**
   * Protected route - requires valid JWT token
   * Usage: GET /api/protected/profile -H "Authorization: Bearer <access_token>"
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    // req.user contains the validated user from JWT payload
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }

  /**
   * Another protected route example
   */
  @Get('data')
  @UseGuards(JwtAuthGuard)
  getData(@Request() req) {
    return {
      userId: req.user.id,
      email: req.user.email,
      data: 'Some protected data',
    };
  }
}
