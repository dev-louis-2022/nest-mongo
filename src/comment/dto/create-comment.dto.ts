import { PickType } from '@nestjs/swagger';
import { Comment } from '../comment.schema';

export class CreateCommentDto extends PickType(Comment, ['info', 'content']) {}
