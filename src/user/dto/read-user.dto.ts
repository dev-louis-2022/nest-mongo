import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class ReadUserDto extends PickType(User, [
  'email',
  'name',
  'imgUrl',
] as const) {
  @ApiProperty({
    example: '293943832',
    description: 'id',
  })
  id: string;
}
