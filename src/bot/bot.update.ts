import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';
import { Context, ContextOf, On, Once } from 'necord';
import { Player } from 'discord-player';
import { PlayerUpdate } from '../player/player.update';
import { TrackService } from '../track/track.service';

@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  public constructor(
    private readonly client: Client,
    private readonly playerUpdate: PlayerUpdate,
    private readonly trackService: TrackService,
  ) {}

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.tag}!`);

    const player: Player = new Player(client, {
      skipFFmpeg: false,
      ytdlOptions: {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1 << 25,
      },
    });
    await player.extractors.loadDefault();

    await this.trackService.initTracks();
    this.playerUpdate.start();
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @On('error')
  public onError(@Context() [error]: ContextOf<'error'>) {
    this.logger.error(error);
  }
}
