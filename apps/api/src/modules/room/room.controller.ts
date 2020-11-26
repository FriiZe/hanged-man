import {
  Body,
  Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards,
} from '@nestjs/common';

import { LoggedUserDto } from '../../common/dtos/logged-user.dto';
import { LoggedUser } from '../../decorators/logged-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { PlayerDto } from '../player/dtos/player.dto';
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

  @Get('/:id')
  public async get(@Param('id') id: string): Promise<RoomDto> {
    const result = await this.roomService.get(id);

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
  public async join(@Param('id') id: string, @LoggedUser() user: LoggedUserDto, @Body('code') code?: string): Promise<void> {
    await this.roomService.join({ roomId: id, userId: user.id, code });
  }

  @Post('/:id/leave')
  @HttpCode(HttpStatus.ACCEPTED)
  public async leave(@Param('id') id: string, @LoggedUser() user: LoggedUserDto): Promise<void> {
    await this.roomService.leave({ roomId: id, userId: user.id });
  }

  @Get('/:id/players')
  public async players(@Param('id') id: string): Promise<PlayerDto[]> {
    const result = await this.roomService.players(id);

    return result;
  }
}
