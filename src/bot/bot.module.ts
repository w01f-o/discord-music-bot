import { Module } from '@nestjs/common';
import { GatewayIntentBits } from 'discord.js';
import { NecordModule } from 'necord';
import { BotUpdate } from './bot.update';
import { ConfigModule } from '@nestjs/config';
import { getBotConfig } from '../config/bot.config';
import { PlayerUpdate } from '../player/player.update';
import { EmbedService } from '../embed/embed.service';
import { TrackService } from '../track/track.service';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getBotConfig],
    }),
    NecordModule.forRoot({
      token: getBotConfig().discord_bot_token,
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
      development: [getBotConfig().discord_dev_guild],
    }),
  ],
  providers: [
    BotUpdate,
    PlayerUpdate,
    EmbedService,
    TrackService,
    DatabaseService,
  ],
})
export class BotModule {}
