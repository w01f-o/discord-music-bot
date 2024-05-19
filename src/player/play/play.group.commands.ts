import {
  Context,
  createCommandGroupDecorator,
  Options,
  SlashCommandContext,
  Subcommand,
} from 'necord';
import { getBotConfig } from '../../config/bot.config';
import { PlayerService } from '../player.service';
import { PlayLocalDto, PlayUrlDto } from '../dto/play.dto';
import { LocalTrackAutocompleteInterceptor } from './play.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { Track } from 'discord-player';
import { EmbedService } from '../../embed/embed.service';
import { PlayerCommands } from '../player.commands';

export const PlayCommandDecorator = createCommandGroupDecorator({
  name: 'play',
  description: 'Запустить трек',
  guilds: [getBotConfig().discord_dev_guild],
});

@PlayCommandDecorator()
export class PlayUrlCommand {
  constructor(
    private readonly playerService: PlayerService,
    private readonly embedService: EmbedService,
    private readonly playerCommands: PlayerCommands,
  ) {}

  @Subcommand({
    name: 'url',
    description:
      'Треки по ссылке (Youtube, Apple music, Spotify, SoundCloud или текстовый запрос)',
  })
  public async onPlay(
    @Context() [interaction]: SlashCommandContext,
    @Options() { requestedTrack }: PlayUrlDto,
  ) {
    await interaction.deferReply();

    try {
      const response = await this.playerService.play(
        interaction,
        requestedTrack,
        false,
      );

      if (response instanceof Track) {
        return await interaction.followUp({
          embeds: [this.embedService.queue(response, interaction)],
        });
      } else {
        return await interaction.followUp({
          embeds: [this.embedService.info(response.response)],
        });
      }
    } catch (e) {
      return await this.playerCommands.error(interaction, e);
    }
  }
}

@PlayCommandDecorator()
export class PlayLocalCommand {
  constructor(
    private readonly playerService: PlayerService,
    private readonly embedService: EmbedService,
    private readonly playerCommands: PlayerCommands,
  ) {}

  @UseInterceptors(LocalTrackAutocompleteInterceptor)
  @Subcommand({
    name: 'local',
    description: 'Наши треки',
  })
  public async onPlay(
    @Context() [interaction]: SlashCommandContext,
    @Options() { requestedTrack }: PlayLocalDto,
  ) {
    await interaction.deferReply();

    try {
      const response = await this.playerService.play(
        interaction,
        requestedTrack,
        true,
      );

      if (response instanceof Track) {
        return await interaction.followUp({
          embeds: [this.embedService.queue(response, interaction)],
        });
      } else {
        return await interaction.followUp({
          embeds: [this.embedService.info(response.response)],
        });
      }
    } catch (e) {
      return await this.playerCommands.error(interaction, e);
    }
  }
}
