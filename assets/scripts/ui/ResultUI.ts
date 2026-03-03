import { _decorator, Button, Component, Label } from "cc";
import { GameManager } from "../core/GameManager";
const { ccclass, property } = _decorator;

@ccclass("ResultUI")
export class ResultUI extends Component {
  @property(Label)
  public rankLabel: Label | null = null;

  @property(Label)
  public rewardLabel: Label | null = null;

  @property(Label)
  public totalScoreLabel: Label | null = null;

  @property(Button)
  public replayButton: Button | null = null;

  protected onLoad(): void {
    this.replayButton?.node?.on(Button.EventType.CLICK, this.onReplayClicked, this);
    this.refresh();
  }

  protected onDestroy(): void {
    this.replayButton?.node?.off(Button.EventType.CLICK, this.onReplayClicked, this);
  }

  private refresh(): void {
    const gameManager = GameManager.getInstance();
    const result = gameManager.getLastPlayResult();
    const user = gameManager.getUser();

    if (this.rankLabel) {
      this.rankLabel.string = result ? `Rank: ${result.rank}` : "Rank: -";
    }
    if (this.rewardLabel) {
      this.rewardLabel.string = result ? `Reward: +${result.reward}` : "Reward: +0";
    }
    if (this.totalScoreLabel) {
      this.totalScoreLabel.string = `Score: ${user?.score ?? 0}`;
    }
  }

  private onReplayClicked(): void {
    console.log("[ResultUI] Replay clicked");
    GameManager.getInstance().loadRace();
  }
}
