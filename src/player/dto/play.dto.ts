import { StringOption } from 'necord';

export class PlayUrlDto {
  @StringOption({
    name: 'url',
    description: 'Ссылка или запрос',
    required: true,
  })
  requestedTrack: string;
}

export class PlayLocalDto {
  @StringOption({
    name: 'track',
    description: 'Трек',
    required: true,
    autocomplete: true,
  })
  requestedTrack: string;
}
