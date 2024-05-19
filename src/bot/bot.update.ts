import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';
import { Context, ContextOf, On, Once } from 'necord';
import { Player } from 'discord-player';
import { PlayerUpdate } from '../player/player.update';

@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  public constructor(
    private readonly client: Client,
    private readonly playerUpdate: PlayerUpdate,
  ) {}

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.tag}!`);
    // this.botInfo = {
    //   name: client.user.displayName,
    //   iconURL: client.user.displayAvatarURL(),
    // };

    const player: Player = new Player(client, {
      skipFFmpeg: false,
      ytdlOptions: {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1 << 25,
      },
    });
    await player.extractors.loadDefault();

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
