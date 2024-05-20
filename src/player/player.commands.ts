import { Injectable } from '@nestjs/common';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { getBotConfig } from '../config/bot.config';
import { PlayerService } from './player.service';
import { LoopDto } from './dto/loop.dto';
import { EmbedService } from '../embed/embed.service';
import { ChatInputCommandInteraction } from 'discord.js';
import { CommandResponseDto } from './dto/commandResponse.dto';

@Injectable()
export class PlayerCommands {
  constructor(
    private readonly playerService: PlayerService,
    private readonly embedService: EmbedService,
  ) {}

  public async error(interaction: ChatInputCommandInteraction, e: any) {
    return await interaction.followUp({
      embeds: [this.embedService.error(`${e}`)],
    });
  }

  @SlashCommand({
    name: 'pause',
    description: 'Поставить на паузу / Продолжить воспроизведение',
    guilds: [getBotConfig().discord_dev_guild],
  })
  public async onPause(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();

    try {
      const { response } = this.playerService.pause(interaction);

      return interaction.followUp({
        embeds: [this.embedService.info(response)],
      });
    } catch (e) {
      return this.error(interaction, e);
    }
  }

  @SlashCommand({
    name: 'stop',
    description: 'Выгнать бота',
    guilds: [getBotConfig().discord_dev_guild],
  })
  public async onStop(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();

    try {
      const { response } = this.playerService.stop(interaction);

      return await interaction.followUp({
        embeds: [this.embedService.info(response)],
      });
    } catch (e) {
      return this.error(interaction, e);
    }
  }

  @SlashCommand({
    name: 'next',
    description: 'Следующий трек',
    guilds: [getBotConfig().discord_dev_guild],
  })
  public async onNext(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();

    try {
      const { response } = this.playerService.next(interaction);

      return await interaction.followUp({
        embeds: [this.embedService.info(response)],
      });
    } catch (e) {
      return this.error(interaction, e);
    }
  }

  @SlashCommand({
    name: 'prev',
    description: 'Предыдущий трек',
    guilds: [getBotConfig().discord_dev_guild],
  })
  public async onPrev(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();

    try {
      const { response } = await this.playerService.prev(interaction);

      return await interaction.followUp({
        embeds: [this.embedService.info(response)],
      });
    } catch (e) {
      return this.error(interaction, e);
    }
  }

  @SlashCommand({
    name: 'queue',
    description: 'Получить список очереди',
    guilds: [getBotConfig().discord_dev_guild],
  })
  public async onQueue(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();

    try {
      const response = this.playerService.queue(interaction);

      if (response instanceof CommandResponseDto) {
        return await interaction.followUp({
          embeds: [this.embedService.info(response.response)],
        });
      } else {
        return await interaction.followUp({
          embeds: [this.embedService.queueList(response)],
        });
      }
    } catch (e: any) {
      return this.error(interaction, e);
    }
  }

  @SlashCommand({
    name: 'loop',
    description: 'Выбрать режим зацикливания',
    guilds: [getBotConfig().discord_dev_guild],
  })
  public async onLoop(
    @Context() [interaction]: SlashCommandContext,
    @Options() { mode }: LoopDto,
  ) {
    await interaction.deferReply();

    try {
      const { response, description } = this.playerService.loop(
        interaction,
        mode,
      );

      return await interaction.followUp({
        embeds: [this.embedService.info(response, description)],
      });
    } catch (e: any) {
      return this.error(interaction, e);
    }
  }

  @SlashCommand({
    name: 'bassboost',
    description: 'Включить/выключить режим бассбуста',
    guilds: [getBotConfig().discord_dev_guild],
  })
  public async onBassboost(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();

    try {
      const { response } = await this.playerService.bassboost(interaction);

      return await interaction.followUp({
        embeds: [this.embedService.info(response)],
      });
    } catch (e) {
      return this.error(interaction, e);
    }
  }
}
