import { Injectable } from '@angular/core';
import {Player} from "bitmovin-javascript/dist/player";

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
  }
}
