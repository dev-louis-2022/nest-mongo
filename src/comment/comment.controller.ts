import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/user.schema';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '사용자 프로필 댓글 등록' })
  @Post()
  async create(@Body() body: CreateCommentDto, @CurrentUser() user: User) {
    return await this.commentService.create(body, user.id);
  }

  @ApiOperation({ summary: '모든 댓글 가져오기' })
  @Get('all/:id')
  async getAll(@Param('id') id: string) {
    return await this.commentService.getAll(id);
  }

  @ApiOperation({ summary: '댓글 좋아요 수 올리기' })
  @Patch('like/:id')
  async plusLike(@Param('id') id: string) {
    return await this.commentService.plusLike(id);
  }
}
