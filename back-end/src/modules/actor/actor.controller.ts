import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '@/decorator/customize';

import { ActorService } from './actor.service';

@Controller('actor')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}
  @Get('/:id')
  @Public()
  async getActorById(@Param('id') id: string) {
    return this.actorService.getActorById(id);
  }
}
