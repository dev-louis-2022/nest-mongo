import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { multerOptions } from 'src/common/utils/multer.options';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOkResponse({
    type: ReadUserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CreateUserDto) {
    return await this.userService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async logIn(@Body() body: LoginUserDto) {
    return await this.authService.jwtLogIn(body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '현재 유저 정보 가져오기' })
  @Get()
  async getUser(@CurrentUser() user) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('image', 1, multerOptions('users')))
  @ApiOperation({ summary: '프로필 사진 업로드' })
  @Post('uploadprofile')
  async uploadProfileImg(
    @UploadedFiles()
    files: Express.Multer.File[],
    @CurrentUser() user: User,
  ) {
    console.log(files[0]);
    return await this.userService.uploadProfileImg(user.id, files);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '모든 유저 조회' })
  @Get('all')
  async getAll() {
    return this.userService.getAll();
  }
}
