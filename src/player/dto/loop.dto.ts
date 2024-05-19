import { StringOption } from 'necord';

export class LoopDto {
  @StringOption({
    name: 'mode',
    description: 'Режим воспроизведения',
    required: true,
    choices: [
      { name: 'По умолчанию (без цикла)', value: '0' },
      { name: 'Зациклить текущий трек', value: '1' },
      { name: 'Зациклить очередь', value: '2' },
    ],
  })
  mode: string;
}
