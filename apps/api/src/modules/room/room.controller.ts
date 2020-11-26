import {
  Body,
  Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards,
} from '@nestjs/common';

import { LoggedUserDto } from '../../common/dtos/logged-user.dto';
import { LoggedUser } from '../../decorators/logged-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomDto } from './dtos/room.dto';
import { RoomService } from './room.service';

@Controller('/rooms')
@UseGuards(AuthGuard)
export class RoomController {
  public constructor(
    private readonly roomService: RoomService,
  ) {}

  @Get('/')
  public async list(): Promise<RoomDto[]> {
    const result = await this.roomService.list();

    return result;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() body: CreateRoomDto, @LoggedUser() user: LoggedUserDto): Promise<RoomDto> {
    const result = await this.roomService.create(body, user.id);

    return result;
  }

  @Post('/:id/join')
  @HttpCode(HttpStatus.ACCEPTED)
  public async join(@Param('id') id: string, @LoggedUser() user: LoggedUserDto): Promise<void> {
    await this.roomService.join({ roomId: id, userId: user.id });
  }

  @Post('/:id/leave')
  @HttpCode(HttpStatus.ACCEPTED)
  public async leave(@Param('id') id: string, @LoggedUser() user: LoggedUserDto): Promise<void> {
    await this.roomService.leave({ roomId: id, userId: user.id });
  }
}
