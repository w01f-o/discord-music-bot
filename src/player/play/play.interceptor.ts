import { Injectable } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';
import { AutocompleteInterceptor } from 'necord';
import { TrackService } from '../../track/track.service';

@Injectable()
export class LocalTrackAutocompleteInterceptor extends AutocompleteInterceptor {
  constructor(private readonly trackService: TrackService) {
    super();
  }

  public transformOptions(interaction: AutocompleteInteraction) {
    const localTracks = this.trackService.findAll();
    const focused = interaction.options.getFocused(true);
    const focusedValue = focused.value.toLowerCase().trim();

    const choices: { name: string; value: string }[] = localTracks
      .filter((track) => track.name.toLowerCase().trim().includes(focusedValue))
      .map((track) => ({ name: track.name, value: track.value }));

    return interaction.respond(choices.slice(0, 25));
  }
}
