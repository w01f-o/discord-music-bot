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

    return interaction.respond(localTracks.slice(0, 25));
  }
}
