import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import bcrypt from 'bcrypt';
import mongoose, { Model } from 'mongoose';
import { Comment, CommentSchema } from 'src/comment/comment.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async signUp(body: CreateUserDto) {
    const { email, name, password } = body;
    const isUserExist = await this.userModel.exists({ email });

    if (isUserExist) {
      throw new UnauthorizedException('이미 존재하는 이메일주소 입니다.');
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const user = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }

  async uploadProfileImg(id: number, files: Express.Multer.File[]) {
    const fileName = `users/${files[0].filename}`;

    console.log(fileName);

    const findedUser = await this.userModel.findById(id);
    findedUser.imgUrl = `http://localhost:3000/media/${fileName}`;

    const newUser = await findedUser.save();

    return newUser.readOnlyData;
  }

  async getAll() {
    // const CommentModel = mongoose.model(Comment.name, CommentSchema);
    // return this.userModel.find().populate('comments', CommentModel);
    return (await this.userModel.find()).map((user) => user.readOnlyData);
  }
}
