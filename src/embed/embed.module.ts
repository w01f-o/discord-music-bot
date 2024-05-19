import { Module } from '@nestjs/common';
import { EmbedService } from './embed.service';

@Module({
  providers: [EmbedService],
})
export class EmbedModule {}
