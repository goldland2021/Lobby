import { _decorator, Button, Component, Label } from "cc";
import { GameManager } from "../core/GameManager";
import { RaceManager } from "../game/RaceManager";
import type { PlayResult } from "../types/ApiTypes";
const { ccclass, property } = _decorator;

@ccclass("RaceUI")
export class RaceUI extends Component {
  @property(Label)
  public countdownLabel: Label | null = null;

  @property(Button)
  public startButton: Button | null = null;

  @property(RaceManager)
  public raceManager: RaceManager | null = null;

  protected onLoad(): void {
    this.startButton?.node?.on(Button.EventType.CLICK, this.onStartClicked, this);
    this.raceManager?.onRaceFinished(this.onRaceFinished, this);
  }

  protected onDestroy(): void {
    this.startButton?.node?.off(Button.EventType.CLICK, this.onStartClicked, this);
    this.raceManager?.offRaceFinished(this.onRaceFinished, this);
  }

  private async onStartClicked(): Promise<void> {
    if (!this.startButton || !this.raceManager || !this.startButton.interactable) {
      return;
    }

    this.startButton.interactable = false;
    if (this.countdownLabel) {
      this.countdownLabel.string = "Racing...";
    }

    try {
      await this.raceManager.startRace();
    } catch (error: unknown) {
      if (this.countdownLabel) {
        this.countdownLabel.string = error instanceof Error ? error.message : "Race failed";
      }
      this.startButton.interactable = true;
    }
  }

  private onRaceFinished(result: PlayResult): void {
    if (this.countdownLabel) {
      this.countdownLabel.string = "Finished";
    }

    const gameManager = GameManager.getInstance();
    gameManager.setLastPlayResult(result);
    gameManager.loadResult();
  }
}
