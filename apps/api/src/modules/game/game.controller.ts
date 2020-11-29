import {
  Body,
  Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards,
} from '@nestjs/common';

import { LoggedUserDto } from '../../common/dtos/logged-user.dto';
import { LoggedUser } from '../../decorators/logged-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateGameDto } from './dtos/create-game.dto';
import { GameDto } from './dtos/game.dto';
import { GameService } from './game.service';

@Controller('/games')
@UseGuards(AuthGuard)
export class GameController {
  public constructor(
    private readonly gameService: GameService,
  ) {}

  @Get('/:id')
  public async get(@Param('id') id: string): Promise<GameDto> {
    const result = await this.gameService.get(id);

    return result;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  public async create(@Body() body: CreateGameDto, @LoggedUser() loggedUser: LoggedUserDto): Promise<GameDto> {
    const result = await this.gameService.create(body.roomId, loggedUser.id, body.trials);

    return result;
  }
}
