import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TrackService {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async initTracks() {
    const localTracksDir = path.resolve('audio');
    const localTracks = fs.readdirSync(localTracksDir);

    const tracks = localTracks.map((track) => {
      const matches = track.match(/^(.*?)\s*-\s*(.*?)$/);

      if (matches) {
        return {
          name: matches[2].replace(/\.[^/.]+$/, ''),
          author: matches[1],
          fileName: track,
        };
      }
    });

    await this.databaseService.track.deleteMany();
    await this.databaseService.track.createMany({
      data: tracks,
    });
  }

  public findAll() {
    return this.databaseService.track.findMany();
  }
}
