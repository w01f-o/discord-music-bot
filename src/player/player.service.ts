import { Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import {
  GuildQueue,
  GuildQueueHistory,
  Player,
  QueryType,
  QueueRepeatMode,
  Track,
  useHistory,
  useMainPlayer,
  useQueue,
} from 'discord-player';
import { EmbedService } from '../embed/embed.service';
import { CommandResponseDto } from './dto/commandResponseDto';

@Injectable()
export class PlayerService {
  constructor(private readonly embedService: EmbedService) {}

  public async play(
    interaction: ChatInputCommandInteraction,
    requestedTrack: string,
    isLocalTrack: boolean,
  ): Promise<Track | CommandResponseDto> {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return new CommandResponseDto(
        'Вы должны находиться в голосовом канале, чтобы я смог к вам зайти',
      );
    }

    const player: Player = useMainPlayer();

    const { track } = await player.play(voiceChannel, requestedTrack, {
      nodeOptions: {
        metadata: interaction,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 120000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 120000,
      },
      searchEngine: isLocalTrack ? QueryType.FILE : QueryType.AUTO,
    });

    return track;
  }

  public pause(interaction: ChatInputCommandInteraction): CommandResponseDto {
    const queue: GuildQueue = useQueue(interaction.guild.id);

    if (queue?.isPlaying()) {
      queue.node.setPaused(!queue.node.isPaused());

      return new CommandResponseDto(
        `${queue.node.isPaused() ? 'Воспроизведение приостановлено' : 'Воспроизведение возобновлено'}` as string,
      );
    } else {
      return new CommandResponseDto('Ничего не проигрывается' as string);
    }
  }

  public stop(interaction: ChatInputCommandInteraction): CommandResponseDto {
    const queue: GuildQueue = useQueue(interaction.guild.id);

    queue?.delete();

    return new CommandResponseDto('Бот вышел' as string);
  }

  public next(interaction: ChatInputCommandInteraction): CommandResponseDto {
    const queue: GuildQueue = useQueue(interaction.guild.id);

    if (queue?.isPlaying()) {
      queue.node.skip();

      return new CommandResponseDto('Трек был пропущен' as string);
    } else {
      return new CommandResponseDto('Ничего не проигрывается' as string);
    }
  }

  public async prev(
    interaction: ChatInputCommandInteraction,
  ): Promise<CommandResponseDto> {
    const interactionGuildId = interaction.guild.id;
    const history: GuildQueueHistory = useHistory(interactionGuildId);
    const queue: GuildQueue = useQueue(interactionGuildId);

    if (queue?.repeatMode !== QueueRepeatMode.TRACK) {
      await history?.previous();
    } else {
      queue?.node.skip();
    }

    return new CommandResponseDto('Включён предыдущий трек' as string);
  }

  public loop(
    interaction: ChatInputCommandInteraction,
    selectedMode: string,
  ): CommandResponseDto {
    const repeatModeNames = {
      0: 'По умолчанию (без цикла)',
      1: 'Зациклить текущий трек',
      2: 'Зациклить очередь',
    };
    const queue: GuildQueue = useQueue(interaction.guild.id);

    queue.setRepeatMode(+selectedMode);

    return new CommandResponseDto(
      'Выставлен режим цикла:' as string,
      repeatModeNames[+selectedMode],
    );
  }

  public queue(
    interaction: ChatInputCommandInteraction,
  ): Track[] | CommandResponseDto {
    const queue: GuildQueue = useQueue(interaction.guild.id);

    const tracks = queue?.tracks.toArray();

    if (tracks.length) {
      return tracks;
    } else {
      return new CommandResponseDto('Очередь пуста');
    }
  }
}