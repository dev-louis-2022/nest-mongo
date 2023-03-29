import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Types, SchemaOptions, Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Comment extends Document {
  @ApiProperty({
    description: '작성한 사용자 ID',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  @IsNotEmpty()
  author: Types.ObjectId;

  @ApiProperty({
    description: '댓글 내용',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '좋아요 수',
  })
  @Prop({ default: 0 })
  @IsPositive()
  likeCount: number;

  @ApiProperty({ description: '대상 ID', required: true })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  @IsNotEmpty()
  info: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
