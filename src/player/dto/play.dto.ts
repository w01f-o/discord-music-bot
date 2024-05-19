import { StringOption } from 'necord';
import { TrackService } from '../../track/track.service';

export class PlayUrlDto {
  @StringOption({
    name: 'url',
    description: 'Ссылка или запрос',
    required: true,
  })
  requestedTrack: string;
}

export class PlayLocalDto {
  constructor(private trackService: TrackService = new TrackService()) {}

  @StringOption({
    name: 'track',
    description: 'Трек',
    required: true,
    autocomplete: true,
  })
  requestedTrack: string;
}
