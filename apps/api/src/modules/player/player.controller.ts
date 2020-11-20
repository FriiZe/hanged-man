import {
  Body,
  Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { IdDto } from '../../common/dtos/id.dto';
import { LoggedUserDto } from '../../common/dtos/logged-user.dto';
import { LoggedUser } from '../../decorators/logged-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { PlayerDto } from './dtos/player.dto';
import { PlayerService } from './player.service';

@Controller('/players')
@UseGuards(AuthGuard)
export class PlayerController {
  public constructor(
    private readonly playerService: PlayerService,
  ) {}

  @Get('/me')
  public async me(@LoggedUser() user: LoggedUserDto): Promise<PlayerDto> {
    const result = await this.playerService.me(user.id);

    return result;
  }

  @Get('/:id')
  public async get(@Param('id', ParseUUIDPipe) id: string): Promise<PlayerDto> {
    const player = await this.playerService.get(id);

    return player;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body('displayName') displayName: string, @LoggedUser() user: LoggedUserDto): Promise<IdDto> {
    const result = await this.playerService.create({ displayName, userId: user.id });

    return result;
  }

  @Patch('/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(@Body('displayName') displayName: string, @LoggedUser() user: LoggedUserDto): Promise<void> {
    await this.playerService.update({ displayName, userId: user.id });
  }
}
