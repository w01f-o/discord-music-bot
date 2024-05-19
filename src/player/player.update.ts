import { Injectable, Logger } from '@nestjs/common';
import { Player, Track, useMainPlayer } from 'discord-player';
import { TextChannel } from 'discord.js';
import { EmbedService } from '../embed/embed.service';

@Injectable()
export class PlayerUpdate {
  private readonly logger = new Logger(PlayerUpdate.name);
  private player: Player;

  constructor(private readonly embedService: EmbedService) {}

  public start() {
    this.player = useMainPlayer();

    this.player.events.on('playerStart', async (queue, track: Track) => {
      const textChannel = queue.metadata?.channel as TextChannel;

      await textChannel.send({
        embeds: [this.embedService.currentTrack(track)],
      });
      this.logger.log(`Сейчас играет ${track.title} - ${track.author}`);
    });

    this.player.events.on('playerError', (_queue, error) => {
      this.logger.error(error);
    });

    this.player.events.on('error', (_queue, error) => {
      this.logger.error(error);
    });

    this.player.events.on('disconnect', async (queue) => {
      const textChannel = queue.metadata?.channel as TextChannel;

      await textChannel.send({
        embeds: [this.embedService.info('Моя работа окончена, я пошёл!')],
      });
      this.logger.log('Бот вышел');
    });

    this.player.events.on('emptyChannel', async (queue) => {
      const textChannel = queue.metadata?.channel as TextChannel;

      await textChannel.send({
        embeds: [
          this.embedService.info(
            'Выхожу, потому-что в голосом канале нет активности в течении 2-ух минут',
          ),
        ],
      });
      this.logger.log('Бот вышел');
    });

    this.player.events.on('emptyQueue', async (queue) => {
      const textChannel = queue.metadata?.channel as TextChannel;

      await textChannel.send({
        embeds: [this.embedService.info('Очередь пуста')],
      });
      this.logger.log('Очередь пуста');
    });
  }
}
