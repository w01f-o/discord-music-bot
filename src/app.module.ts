import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { PlayerModule } from './player/player.module';
import { EmbedModule } from './embed/embed.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [BotModule, PlayerModule, EmbedModule, TrackModule],
})
export class AppModule {}
