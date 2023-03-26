import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Comment } from './comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(body: CreateCommentDto, id: string) {
    try {
      const { info, content } = body;
      const targetUser = await this.userModel.findById(info);
      if (!targetUser) {
        throw new BadRequestException('해당 유저가 존재하지 않습니다.');
      }
      return await this.commentModel.create({
        author: id,
        content,
        info,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(id: string) {
    try {
      return await this.commentModel.find();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async plusLike(id: string) {
    try {
      const comment = await this.commentModel.findById(id);
      comment.likeCount++;
      return await comment.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
