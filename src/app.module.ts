import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { PlayerModule } from './player/player.module';
import { EmbedModule } from './embed/embed.module';
import { TrackModule } from './track/track.module';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve('audio'),
      serveRoot: '/ds_bot',
    }),
    BotModule,
    PlayerModule,
    EmbedModule,
    TrackModule,
    DatabaseModule,
  ],
})
export class AppModule {}
