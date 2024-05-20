import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService, DatabaseService],
})
export class TrackModule {}
