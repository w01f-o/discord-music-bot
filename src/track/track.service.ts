import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class TrackService {
  findAll() {
    const localTracksDir = path.resolve('audio');
    const localTracks = fs.readdirSync(localTracksDir);

    return localTracks.map((track) => ({
      name: track.replace(/\.[^/.]+$/, ''),
      value: path.join(localTracksDir, track),
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} track`;
  }
}
