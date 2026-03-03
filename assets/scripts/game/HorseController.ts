import { _decorator, Component, tween, Tween, Vec3 } from "cc";
import { BASE_FINISH_TIME, TRACK_END_X, TRACK_START_X } from "../core/Config";
const { ccclass, property } = _decorator;

@ccclass("HorseController")
export class HorseController extends Component {
  @property
  public horseId = 0;

  public resetToStart(): void {
    Tween.stopAllByTarget(this.node);
    const pos = this.node.position.clone();
    this.node.setPosition(new Vec3(TRACK_START_X, pos.y, pos.z));
  }

  public startRace(rankIndex: number): Promise<void> {
    this.resetToStart();
    const duration = BASE_FINISH_TIME + rankIndex * 0.5;
    const pos = this.node.position.clone();

    return new Promise((resolve) => {
      tween(this.node)
        .to(duration, { position: new Vec3(TRACK_END_X, pos.y, pos.z) })
        .call(() => resolve())
        .start();
    });
  }
}
