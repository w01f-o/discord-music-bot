import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerCommands } from './player.commands';
import { PlayerUpdate } from './player.update';
import { EmbedService } from '../embed/embed.service';
import { PlayLocalCommand, PlayUrlCommand } from './play/play.group.commands';
import { TrackService } from '../track/track.service';

@Module({
  providers: [
    PlayerService,
    PlayerCommands,
    PlayerUpdate,
    EmbedService,
    PlayLocalCommand,
    PlayUrlCommand,
    TrackService,
  ],
})
export class PlayerModule {}
