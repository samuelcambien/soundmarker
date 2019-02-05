import {Injectable} from '@angular/core';
import {Project} from "../model/project";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private players: Map<string, any> = new Map();

  constructor() { }

  public getPlayer(trackId: string) {
    return this.players.get(trackId);
  }

  public addPlayer(trackId: string, player) {
    this.players.set(trackId, player);
    player.backend.on("pauseothers", () =>
      this.players.forEach(otherplayer => {
        if (otherplayer !== player) {
          otherplayer.pause();
        }
      })
    );
  }

  public playerReady(trackId: string): boolean {

    let player = this.getPlayer(trackId);
    return player && player.isReady();
  }
}
