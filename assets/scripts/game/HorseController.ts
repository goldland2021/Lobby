import { _decorator, Color, Component, Label, Node, tween, Tween, UITransform, Vec3 } from "cc";
import { TRACK_START_X, TRACK_END_X, BASE_FINISH_TIME } from "../core/Config";

const { ccclass, property } = _decorator;

const HORSE_EMOJIS = ["\uD83C\uDFC7", "\uD83D\uDC0E", "\uD83E\uDD84", "\uD83E\uDD93", "\uD83D\uDC34", "\uD83D\uDC10"];
const HORSE_BADGES = ["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49", "4", "5", "6"];

@ccclass("HorseController")
export class HorseController extends Component {
  @property
  public horseId = 0;

  private iconLabel: Label | null = null;
  private nameLabel: Label | null = null;
  private badgeLabel: Label | null = null;
  private laneY = 0;
  private baseEmoji = "\uD83C\uDFC7";
  private isPlayer = false;

  protected onLoad(): void {
    this.ensureVisuals();
  }

  public configure(horseId: number, laneY: number, isPlayer: boolean): void {
    this.horseId = horseId;
    this.laneY = laneY;
    this.isPlayer = isPlayer;
    this.baseEmoji = isPlayer ? HORSE_EMOJIS[0] : HORSE_EMOJIS[horseId % HORSE_EMOJIS.length];
    this.ensureVisuals();
    this.refreshLabels();
    this.resetToStart();
  }

  public resetToStart(): void {
    Tween.stopAllByTarget(this.node);
    this.node.setScale(Vec3.ONE);
    this.node.setPosition(new Vec3(TRACK_START_X, this.laneY, 0));
    if (this.badgeLabel) {
      this.badgeLabel.string = "";
    }
    this.refreshLabels();
  }

  public setProgress(progress: number, speed: number, isLeading: boolean): void {
    const x = TRACK_START_X + (TRACK_END_X - TRACK_START_X) * Math.min(Math.max(progress, 0), 1);
    const bobbing = Math.sin(progress * Math.PI * 8 + this.horseId) * 4;
    this.node.setPosition(new Vec3(x, this.laneY + bobbing, 0));
    this.node.setScale(isLeading ? new Vec3(1.08, 1.08, 1) : Vec3.ONE);

    if (this.iconLabel) {
      const speedEmoji = speed > 0.14 ? "\uD83D\uDD25" : speed > 0.11 ? "\uD83D\uDCA8" : "";
      this.iconLabel.string = `${this.baseEmoji}${speedEmoji}`;
      this.iconLabel.color = isLeading ? new Color(255, 246, 163, 255) : new Color(255, 255, 255, 255);
    }
  }

  public markFinished(rankIndex: number): void {
    if (this.badgeLabel) {
      this.badgeLabel.string = HORSE_BADGES[rankIndex] ?? `${rankIndex + 1}`;
    }
    if (this.iconLabel) {
      this.iconLabel.string = `${this.baseEmoji}${rankIndex === 0 ? "\u2728" : ""}`;
    }
  }

  public pulseTap(): void {
    tween(this.node)
      .stop()
      .to(0.08, { scale: new Vec3(1.18, 1.18, 1) })
      .to(0.12, { scale: Vec3.ONE })
      .start();
  }

  public runServerRace(rankIndex: number): Promise<void> {
    this.resetToStart();
    const duration = BASE_FINISH_TIME + rankIndex * 0.5;
    if (this.iconLabel) {
      this.iconLabel.color = new Color(255, 255, 255, 255);
    }

    return new Promise((resolve) => {
      tween(this.node)
        .to(duration, { position: new Vec3(TRACK_END_X, this.laneY, 0) })
        .call(() => {
          this.markFinished(rankIndex);
          resolve();
        })
        .start();
    });
  }

  private ensureVisuals(): void {
    const rootTransform = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    rootTransform.setContentSize(140, 56);

    this.iconLabel = this.ensureLabel(this.node, "Icon", 32, new Vec3(0, 0, 0));
    this.nameLabel = this.ensureLabel(this.node, "Name", 16, new Vec3(0, -24, 0));
    this.badgeLabel = this.ensureLabel(this.node, "Badge", 18, new Vec3(50, 18, 0));
    this.refreshLabels();
  }

  private ensureLabel(parent: Node, name: string, fontSize: number, position: Vec3): Label {
    let node = parent.getChildByName(name);
    if (!node) {
      node = new Node(name);
      node.setParent(parent);
    }

    node.setPosition(position);
    const transform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    transform.setContentSize(140, 32);

    const label = node.getComponent(Label) ?? node.addComponent(Label);
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 6;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    return label;
  }

  private refreshLabels(): void {
    if (this.iconLabel) {
      this.iconLabel.string = this.baseEmoji;
    }
    if (this.nameLabel) {
      this.nameLabel.string = this.isPlayer ? "YOU" : `AI ${this.horseId + 1}`;
      this.nameLabel.color = this.isPlayer ? new Color(255, 223, 111, 255) : new Color(214, 228, 255, 255);
    }
  }
}
