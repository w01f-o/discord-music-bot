import { Injectable } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';
import { AutocompleteInterceptor } from 'necord';
import { TrackService } from '../../track/track.service';
import * as path from 'node:path';

@Injectable()
export class LocalTrackAutocompleteInterceptor extends AutocompleteInterceptor {
  constructor(private readonly trackService: TrackService) {
    super();
  }

  public async transformOptions(interaction: AutocompleteInteraction) {
    const localTracks = await this.trackService.findAll();

    const choices = localTracks.map((track) => {
      return {
        name: `${track.author} - ${track.name}`,
        value: path.join(path.resolve('audio'), track.fileName),
      };
    });

    const focused = interaction.options.getFocused(true);
    const focusedValue = focused.value.toLowerCase().trim();

    return interaction.respond(
      choices
        .filter((track) =>
          track.name.toLowerCase().trim().includes(focusedValue),
        )
        .map((track) => ({ name: track.name, value: track.value }))
        .slice(0, 25),
    );
  }
}
