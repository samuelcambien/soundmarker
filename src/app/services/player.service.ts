import {Injectable} from '@angular/core';
import {Player} from "../player";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private players: Map<string, Player> = new Map();

  constructor() { }

  public getPlayer(trackId: string): Player {
    return this.players.get(trackId);
  }

  public addPlayer(trackId: string, player: Player) {
    this.players.set(trackId, player);
  }

  stopAllExcept(player: Player) {
    this.players.forEach(otherplayer => {
      if (otherplayer !== player) {
        otherplayer.stop();
      }
    })
  }
}
