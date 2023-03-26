import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginUserDto) {
    const { email, password } = data;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('이메일을 확인해주세요');
    }

    const isPassowrdValidated = bcrypt.compareSync(password, user.password);

    if (!isPassowrdValidated) {
      throw new UnauthorizedException('비밀번호를 확인해주세요');
    }

    const payload = { email, sub: user.id };

    return { token: this.jwtService.sign(payload) };
  }
}
