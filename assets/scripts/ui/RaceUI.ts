import { _decorator, Button, Color, Component, Input, Label, Node, UITransform, Vec3, director, input, view } from "cc";
import { HORSE_COUNT } from "../core/Config";
import { GameManager } from "../core/GameManager";
import { HorseController } from "../game/HorseController";
import { RaceManager, type RaceProgressSnapshot, RaceState } from "../game/RaceManager";
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

  private statusLabel: Label | null = null;
  private tapHintLabel: Label | null = null;
  private standingsLabel: Label | null = null;
  private canvas: Node | null = null;
  private trackRoot: Node | null = null;

  protected onLoad(): void {
    this.ensureRaceScene();
    this.startButton?.node?.on(Button.EventType.CLICK, this.onStartClicked, this);
    this.raceManager?.onRaceFinished(this.onRaceFinished, this);
    this.raceManager?.onRaceProgress(this.onRaceProgress, this);
    input.on(Input.EventType.TOUCH_START, this.onScreenTapped, this);
  }

  protected onDestroy(): void {
    this.startButton?.node?.off(Button.EventType.CLICK, this.onStartClicked, this);
    this.raceManager?.offRaceFinished(this.onRaceFinished, this);
    this.raceManager?.offRaceProgress(this.onRaceProgress, this);
    input.off(Input.EventType.TOUCH_START, this.onScreenTapped, this);
  }

  private async onStartClicked(): Promise<void> {
    if (!this.startButton || !this.raceManager || !this.startButton.interactable) {
      return;
    }

    this.startButton.interactable = false;
    if (this.countdownLabel) {
      this.countdownLabel.string = "3...2...1... GO!";
    }
    if (this.statusLabel) {
      this.statusLabel.string = "\uD83D\uDC46 Race started. Tap anywhere to boost your horse.";
    }
    if (this.tapHintLabel) {
      this.tapHintLabel.string = "TAP TAP TAP";
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
      this.countdownLabel.string = result.rank === 1 ? "Champion!" : "Race Over";
    }
    if (this.tapHintLabel) {
      this.tapHintLabel.string = result.rank === 1 ? "\uD83E\uDD47 NICE" : "\uD83D\uDD01 TRY AGAIN";
    }
    if (this.statusLabel) {
      this.statusLabel.string = `Rank ${result.rank} / Reward +${result.reward} / Taps ${result.tapCount ?? 0}`;
    }

    const gameManager = GameManager.getInstance();
    gameManager.setLastPlayResult(result);
    this.scheduleOnce(() => {
      gameManager.loadResult();
    }, 1.1);
  }

  private onRaceProgress(snapshot: RaceProgressSnapshot): void {
    if (this.countdownLabel) {
      this.countdownLabel.string = `\u23F1 ${snapshot.elapsedTime.toFixed(1)}s`;
    }
    if (this.statusLabel) {
      const speedPercent = Math.max(0, Math.round((snapshot.playerSpeed - 0.07) * 1000));
      this.statusLabel.string = `Taps ${snapshot.tapCount}  |  Boost ${speedPercent}%  |  Progress ${Math.round(snapshot.playerProgress * 100)}%`;
    }
    if (this.tapHintLabel && this.raceManager?.getState() === RaceState.Racing) {
      this.tapHintLabel.string = snapshot.finishOrder.length > 0 ? "Push harder" : "Tap anywhere";
    }
    if (this.standingsLabel) {
      const podium = snapshot.finishOrder.length
        ? snapshot.finishOrder.map((horseId, index) => `${index + 1}.${horseId === snapshot.playerHorseId ? "YOU" : `AI${horseId + 1}`}`).join("  ")
        : `Leader: ${snapshot.leaderHorseId === snapshot.playerHorseId ? "YOU" : `AI${snapshot.leaderHorseId + 1}`}`;
      this.standingsLabel.string = `\uD83C\uDFC1 ${podium}`;
    }
  }

  private onScreenTapped(): void {
    if (this.raceManager?.getState() !== RaceState.Racing) {
      return;
    }

    this.raceManager.tap();
    if (this.tapHintLabel) {
      this.tapHintLabel.color = new Color(255, 246, 163, 255);
      this.tapHintLabel.string = "\uD83D\uDCA5 TAP!";
    }
  }

  private ensureRaceScene(): void {
    this.canvas = this.findInTree(director.getScene() ?? this.node, "Canvas") ?? this.node;
    this.raceManager = this.raceManager ?? this.getComponent(RaceManager) ?? this.addComponent(RaceManager);

    const size = view.getVisibleSize();
    const scale = Math.min(size.width / 720, size.height / 1280) || 1;

    this.countdownLabel = this.countdownLabel ?? this.ensureLabel(this.canvas, "CountdownLabel", "\uD83C\uDFC7 Ready?", 30, new Vec3(0, 300 * scale, 0));
    this.statusLabel = this.statusLabel ?? this.ensureLabel(
      this.canvas,
      "StatusLabel",
      "Press start to enter the track.",
      22,
      new Vec3(0, 250 * scale, 0)
    );
    this.standingsLabel = this.standingsLabel ?? this.ensureLabel(this.canvas, "StandingsLabel", "\uD83C\uDFC1 Waiting", 18, new Vec3(0, 215 * scale, 0));
    this.tapHintLabel = this.tapHintLabel ?? this.ensureLabel(
      this.canvas,
      "TapHintLabel",
      "\uD83D\uDC47 Start first",
      34,
      new Vec3(0, -300 * scale, 0)
    );
    this.startButton = this.startButton ?? this.ensureButton(this.canvas, "StartButton", "\u25B6 START", new Vec3(0, -235 * scale, 0));

    this.trackRoot = this.findInTree(this.canvas, "TrackRoot");
    if (!this.trackRoot) {
      this.trackRoot = new Node("TrackRoot");
      this.trackRoot.setParent(this.canvas);
    }
    this.trackRoot.setPosition(Vec3.ZERO);

    this.buildTrack(scale);
  }

  private buildTrack(scale: number): void {
    if (!this.trackRoot || !this.raceManager) {
      return;
    }

    this.trackRoot.removeAllChildren();
    const horses: HorseController[] = [];
    const laneSpacing = 74 * scale;
    const laneStartY = 120 * scale;

    const header = this.ensureLabel(this.trackRoot, "TrackHeader", "\uD83D\uDEA9  Emoji Derby  \uD83C\uDFC1", 28, new Vec3(0, 185 * scale, 0));
    header.color = new Color(255, 246, 163, 255);

    for (let index = 0; index < HORSE_COUNT; index += 1) {
      const laneY = laneStartY - index * laneSpacing;
      const laneLabel = this.ensureLabel(
        this.trackRoot,
        `LaneLine${index}`,
        "\uD83D\uDFEB\uD83D\uDFEB\uD83D\uDFEB\uD83D\uDFEB\uD83D\uDFEB\uD83D\uDFEB\uD83D\uDFEB\uD83D\uDFEB\uD83D\uDFEB",
        28,
        new Vec3(0, laneY, 0)
      );
      laneLabel.color = new Color(160, 122, 90, 255);

      const startMarker = this.ensureLabel(this.trackRoot, `Start${index}`, "\uD83D\uDEA9", 26, new Vec3(-285, laneY, 0));
      startMarker.color = new Color(255, 160, 160, 255);
      this.ensureLabel(this.trackRoot, `Finish${index}`, "\uD83C\uDFC1", 26, new Vec3(285, laneY, 0));

      const horseNode = new Node(`Horse${index}`);
      horseNode.setParent(this.trackRoot);
      const controller = horseNode.addComponent(HorseController);
      controller.configure(index, laneY, index === 0);
      horses.push(controller);
    }

    this.raceManager.horses = horses;
  }

  private ensureLabel(parent: Node, name: string, text: string, fontSize: number, position: Vec3): Label {
    let node = this.findInTree(parent, name);
    if (!node) {
      node = new Node(name);
      node.setParent(parent);
    }

    node.setPosition(position);
    const transform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    transform.setContentSize(680, fontSize + 18);

    const label = node.getComponent(Label) ?? node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 8;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    return label;
  }

  private ensureButton(parent: Node, name: string, text: string, position: Vec3): Button {
    let node = this.findInTree(parent, name);
    if (!node) {
      node = new Node(name);
      node.setParent(parent);
    }

    node.setPosition(position);
    const transform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    transform.setContentSize(240, 88);

    const label = node.getComponent(Label) ?? node.addComponent(Label);
    label.string = text;
    label.fontSize = 30;
    label.lineHeight = 36;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(255, 246, 163, 255);

    return node.getComponent(Button) ?? node.addComponent(Button);
  }

  private findInTree(root: Node, name: string): Node | null {
    if (root.name === name) {
      return root;
    }

    for (const child of root.children) {
      const found = this.findInTree(child, name);
      if (found) {
        return found;
      }
    }

    return null;
  }
}
