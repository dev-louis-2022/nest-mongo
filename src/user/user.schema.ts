import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';
import { Comment } from 'src/comment/comment.schema';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'demo@demo.com',
    description: 'email',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({
    default:
      'https://raw.githubusercontent.com/amamov/teaching-nestjs-a-to-z/main/images/1.jpeg',
  })
  @IsString()
  imgUrl: string;

  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
    imgUrl: string;
    comments: Comment[];
  };

  readonly comments: Comment[];
}

const _UserSchema = SchemaFactory.createForClass(User);

_UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
    imgUrl: this.imgUrl,
    comments: this.comments,
  };
});

_UserSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'info',
});
_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

export const UserSchema = _UserSchema;
