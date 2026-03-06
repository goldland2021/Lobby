import { _decorator, Component, EventTarget } from "cc";
import {
  AI_BASE_SPEED_MAX,
  AI_BASE_SPEED_MIN,
  AI_BURST_DECAY,
  AI_BURST_MAX,
  AI_BURST_MIN,
  HORSE_COUNT,
  PLAYER_BASE_SPEED,
  PLAYER_HORSE_ID,
  PLAYER_MAX_MOMENTUM,
  PLAYER_MOMENTUM_DECAY,
  PLAYER_SPEED_PER_MOMENTUM,
  PLAYER_TAP_MOMENTUM,
} from "../core/Config";
import { GameManager } from "../core/GameManager";
import { ApiClient } from "../network/ApiClient";
import type { PlayResult } from "../types/ApiTypes";
import { HorseController } from "./HorseController";

const { ccclass, property } = _decorator;

export enum RaceState {
  Idle = "Idle",
  Racing = "Racing",
  Finished = "Finished",
}

export interface RaceProgressSnapshot {
  elapsedTime: number;
  tapCount: number;
  leaderHorseId: number;
  playerHorseId: number;
  playerProgress: number;
  playerSpeed: number;
  finishOrder: number[];
}

@ccclass("RaceManager")
export class RaceManager extends Component {
  public static readonly EVENT_RACE_FINISHED = "race-finished";
  public static readonly EVENT_RACE_PROGRESS = "race-progress";

  @property([HorseController])
  public horses: HorseController[] = [];

  private readonly eventTarget = new EventTarget();
  private state: RaceState = RaceState.Idle;
  private lastResult: PlayResult | null = null;
  private readonly progress: number[] = [];
  private readonly aiBaseSpeeds: number[] = [];
  private readonly aiBoosts: number[] = [];
  private readonly aiBurstCooldowns: number[] = [];
  private readonly finishOrder: number[] = [];
  private playerHorseId = PLAYER_HORSE_ID;
  private tapCount = 0;
  private tapMomentum = 0;
  private elapsedTime = 0;
  private finishPromise: Promise<PlayResult> | null = null;
  private finishResolver: ((result: PlayResult) => void) | null = null;

  public onRaceFinished(callback: (result: PlayResult) => void, target?: unknown): void {
    this.eventTarget.on(RaceManager.EVENT_RACE_FINISHED, callback, target);
  }

  public offRaceFinished(callback: (result: PlayResult) => void, target?: unknown): void {
    this.eventTarget.off(RaceManager.EVENT_RACE_FINISHED, callback, target);
  }

  public onRaceProgress(callback: (snapshot: RaceProgressSnapshot) => void, target?: unknown): void {
    this.eventTarget.on(RaceManager.EVENT_RACE_PROGRESS, callback, target);
  }

  public offRaceProgress(callback: (snapshot: RaceProgressSnapshot) => void, target?: unknown): void {
    this.eventTarget.off(RaceManager.EVENT_RACE_PROGRESS, callback, target);
  }

  public getState(): RaceState {
    return this.state;
  }

  public getLastResult(): PlayResult | null {
    return this.lastResult;
  }

  public getPlayerHorseId(): number {
    return this.playerHorseId;
  }

  public async startRace(): Promise<PlayResult> {
    if (this.state === RaceState.Racing) {
      throw new Error("Race is already running");
    }

    this.ensureHorseCount();
    this.state = RaceState.Idle;

    const result = await ApiClient.play();
    this.validateServerResult(result);
    this.state = RaceState.Racing;

    const movePromises = this.horses.map((horse) => {
      const rankIndex = result.ranks.indexOf(horse.horseId);
      if (rankIndex < 0) {
        throw new Error(`Horse ${horse.horseId} is missing in ranks`);
      }
      return horse.runServerRace(rankIndex);
    });

    await Promise.all(movePromises);
    this.lastResult = {
      ...result,
      ranks: [...result.ranks],
      playerHorseId: this.playerHorseId,
      usedLocalSimulation: false,
    };
    this.state = RaceState.Finished;
    this.eventTarget.emit(RaceManager.EVENT_RACE_FINISHED, this.lastResult);
    return this.lastResult;
  }

  public async startPracticeRace(): Promise<PlayResult> {
    if (this.state === RaceState.Racing) {
      throw new Error("Race is already running");
    }

    this.ensureHorseCount();
    this.resetRace();
    this.state = RaceState.Racing;
    this.finishPromise = new Promise<PlayResult>((resolve) => {
      this.finishResolver = resolve;
    });
    this.emitProgress();
    return this.finishPromise;
  }

  public tap(): void {
    if (this.state !== RaceState.Racing) {
      return;
    }

    this.tapCount += 1;
    this.tapMomentum = Math.min(PLAYER_MAX_MOMENTUM, this.tapMomentum + PLAYER_TAP_MOMENTUM);
    this.horses[this.playerHorseId]?.pulseTap();
    this.emitProgress();
  }

  protected update(dt: number): void {
    if (this.state !== RaceState.Racing) {
      return;
    }

    this.elapsedTime += dt;
    this.tapMomentum = Math.max(0, this.tapMomentum - dt * PLAYER_MOMENTUM_DECAY);

    const leaderHorseId = this.getLeaderHorseId();
    for (let horseId = 0; horseId < HORSE_COUNT; horseId += 1) {
      if (this.finishOrder.indexOf(horseId) >= 0) {
        continue;
      }

      const speed = horseId === this.playerHorseId ? this.getPlayerSpeed() : this.getAiSpeed(horseId, dt);
      this.progress[horseId] = Math.min(1, this.progress[horseId] + speed * dt);
      this.horses[horseId]?.setProgress(this.progress[horseId], speed, leaderHorseId === horseId);

      if (this.progress[horseId] >= 1) {
        this.finishOrder.push(horseId);
        this.horses[horseId]?.markFinished(this.finishOrder.length - 1);
      }
    }

    this.emitProgress();
    if (this.finishOrder.length === HORSE_COUNT) {
      this.finishRace();
    }
  }

  private resetRace(): void {
    this.progress.length = 0;
    this.aiBaseSpeeds.length = 0;
    this.aiBoosts.length = 0;
    this.aiBurstCooldowns.length = 0;
    this.finishOrder.length = 0;
    this.tapCount = 0;
    this.tapMomentum = 0;
    this.elapsedTime = 0;

    for (let horseId = 0; horseId < HORSE_COUNT; horseId += 1) {
      this.progress[horseId] = 0;
      this.aiBaseSpeeds[horseId] = this.randomRange(AI_BASE_SPEED_MIN, AI_BASE_SPEED_MAX);
      this.aiBoosts[horseId] = 0;
      this.aiBurstCooldowns[horseId] = this.randomRange(0.3, 1.4);
      this.horses[horseId]?.resetToStart();
    }
  }

  private finishRace(): void {
    const ranks = [...this.finishOrder];
    const playerRank = Math.max(1, ranks.indexOf(this.playerHorseId) + 1);
    const currentScore = GameManager.getInstance().getUser()?.score ?? 0;

    const result: PlayResult = {
      ranks,
      winner: ranks[0] ?? this.playerHorseId,
      rank: playerRank,
      reward: 0,
      newScore: currentScore,
      playerHorseId: this.playerHorseId,
      tapCount: this.tapCount,
      durationMs: Math.round(this.elapsedTime * 1000),
      usedLocalSimulation: true,
    };

    this.lastResult = result;
    this.state = RaceState.Finished;
    this.eventTarget.emit(RaceManager.EVENT_RACE_FINISHED, result);
    this.finishResolver?.(result);
    this.finishResolver = null;
    this.finishPromise = null;
  }

  private ensureHorseCount(): void {
    if (this.horses.length !== HORSE_COUNT) {
      throw new Error(`RaceManager.horses must be exactly ${HORSE_COUNT}`);
    }
  }

  private validateServerResult(result: PlayResult): void {
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
  }

  private getLeaderHorseId(): number {
    let leaderHorseId = this.playerHorseId;
    let leaderProgress = -1;

    for (let horseId = 0; horseId < HORSE_COUNT; horseId += 1) {
      if (this.progress[horseId] > leaderProgress) {
        leaderProgress = this.progress[horseId];
        leaderHorseId = horseId;
      }
    }

    return leaderHorseId;
  }

  private getPlayerSpeed(): number {
    const leaderProgress = Math.max(...this.progress);
    const catchupBoost = this.progress[this.playerHorseId] + 0.06 < leaderProgress ? 0.008 : 0;
    return PLAYER_BASE_SPEED + this.tapMomentum * PLAYER_SPEED_PER_MOMENTUM + catchupBoost;
  }

  private getAiSpeed(horseId: number, dt: number): number {
    this.aiBurstCooldowns[horseId] -= dt;
    if (this.aiBurstCooldowns[horseId] <= 0) {
      this.aiBoosts[horseId] = this.randomRange(AI_BURST_MIN, AI_BURST_MAX);
      this.aiBurstCooldowns[horseId] = this.randomRange(0.9, 2.4);
    }

    this.aiBoosts[horseId] = Math.max(0, this.aiBoosts[horseId] - dt * AI_BURST_DECAY);
    const wobble = Math.sin(this.elapsedTime * (1 + horseId * 0.13) + horseId) * 0.004;
    return this.aiBaseSpeeds[horseId] + this.aiBoosts[horseId] + wobble;
  }

  private emitProgress(): void {
    this.eventTarget.emit(RaceManager.EVENT_RACE_PROGRESS, {
      elapsedTime: this.elapsedTime,
      tapCount: this.tapCount,
      leaderHorseId: this.getLeaderHorseId(),
      playerHorseId: this.playerHorseId,
      playerProgress: this.progress[this.playerHorseId] ?? 0,
      playerSpeed: this.getPlayerSpeed(),
      finishOrder: [...this.finishOrder],
    } satisfies RaceProgressSnapshot);
  }

  private randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
}
