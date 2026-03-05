import { _decorator, Component, EventTarget } from "cc";
import { HORSE_COUNT } from "../core/Config";
import { ApiClient } from "../network/ApiClient";
import type { PlayResult } from "../types/ApiTypes";
import { HorseController } from "./HorseController";
const { ccclass, property } = _decorator;

export enum RaceState {
  Idle = "Idle",
  Requesting = "Requesting",
  Racing = "Racing",
  Finished = "Finished",
}

@ccclass("RaceManager")
export class RaceManager extends Component {
  public static readonly EVENT_RACE_FINISHED = "race-finished";

  @property([HorseController])
  public horses: HorseController[] = [];

  private readonly eventTarget = new EventTarget();
  private state: RaceState = RaceState.Idle;
  private lastResult: PlayResult | null = null;

  public onRaceFinished(callback: (result: PlayResult) => void, target?: unknown): void {
    this.eventTarget.on(RaceManager.EVENT_RACE_FINISHED, callback, target);
  }

  public offRaceFinished(callback: (result: PlayResult) => void, target?: unknown): void {
    this.eventTarget.off(RaceManager.EVENT_RACE_FINISHED, callback, target);
  }

  public getState(): RaceState {
    return this.state;
  }

  public getLastResult(): PlayResult | null {
    return this.lastResult;
  }

  public async startRace(): Promise<PlayResult> {
    if (this.state === RaceState.Requesting || this.state === RaceState.Racing) {
      throw new Error("Race is already running");
    }

    this.ensureHorseCount();
    this.state = RaceState.Requesting;

    try {
      const result = await ApiClient.play();
      this.validateResult(result);

      this.state = RaceState.Racing;
      const movePromises = this.horses.map((horse) => {
        const rankIndex = result.ranks.indexOf(horse.horseId);
        if (rankIndex < 0) {
          throw new Error(`Horse ${horse.horseId} is missing in ranks`);
        }
        return horse.startRace(rankIndex);
      });

      await Promise.all(movePromises);

      this.lastResult = result;
      this.state = RaceState.Finished;
      this.eventTarget.emit(RaceManager.EVENT_RACE_FINISHED, result);
      return result;
    } catch (error) {
      this.state = RaceState.Idle;
      throw error;
    }
  }

  public async startPracticeRace(): Promise<PlayResult> {
    if (this.state === RaceState.Requesting || this.state === RaceState.Racing) {
      throw new Error("Race is already running");
    }

    this.ensureHorseCount();
    this.state = RaceState.Racing;

    const result: PlayResult = {
      ranks: [0, 1, 2, 3, 4, 5],
      winner: 0,
      rank: 1,
      reward: 0,
      newScore: 0,
    };

    try {
      const movePromises = this.horses.map((horse) => {
        const rankIndex = result.ranks.indexOf(horse.horseId);
        if (rankIndex < 0) {
          throw new Error(`Horse ${horse.horseId} is missing in ranks`);
        }
        return horse.startRace(rankIndex);
      });

      await Promise.all(movePromises);

      this.lastResult = result;
      this.state = RaceState.Finished;
      this.eventTarget.emit(RaceManager.EVENT_RACE_FINISHED, result);
      return result;
    } catch (error) {
      this.state = RaceState.Idle;
      throw error;
    }
  }

  private ensureHorseCount(): void {
    if (this.horses.length !== HORSE_COUNT) {
      throw new Error(`RaceManager.horses must be exactly ${HORSE_COUNT}`);
    }
  }

  private validateResult(result: PlayResult): void {
    if (result.ranks.length !== HORSE_COUNT) {
      throw new Error(`Invalid ranks length: expected ${HORSE_COUNT}`);
    }

    const unique = new Set(result.ranks);
    if (unique.size !== HORSE_COUNT) {
      throw new Error("Invalid ranks: must be unique");
    }
    for (const horseId of result.ranks) {
      if (horseId < 0 || horseId >= HORSE_COUNT) {
        throw new Error(`Invalid horse id in ranks: ${horseId}`);
      }
    }

    if (result.winner !== result.ranks[0]) {
      throw new Error("Invalid result: winner must equal ranks[0]");
    }
  }
}
