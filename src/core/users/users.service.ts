import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DbService) {}

  async create(createUserDto: CreateUserDto) {
    const isExists = await this.findByEmail(createUserDto.email);
    if (isExists) {
      throw new ConflictException('User already exists');
    }
    const user = await this.db.user.create({
      data: createUserDto,
    });
    return user;
  }

  async findAll() {
    const users = await this.db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
    return users;
  }

  async findById(id: string) {
    const user = await this.db.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.db.user.findUnique({
      where: { email },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.db.user.update({
      where: { id },
      data: updateUserDto,
    });
    return user;
  }

  async remove(id: string) {
    const user = await this.db.user.delete({
      where: { id },
    });
    return user;
  }
}
