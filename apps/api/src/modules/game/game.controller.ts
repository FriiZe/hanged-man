import {
  Body,
  Controller, HttpCode, HttpStatus, Post, UseGuards,
} from '@nestjs/common';

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

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  public async create(@Body() body: CreateGameDto): Promise<GameDto> {
    const result = await this.gameService.create(body.roomId, body.trials);

    return result;
  }
}
