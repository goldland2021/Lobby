import { _decorator, Button, Color, Component, Label, Node, UITransform, Vec3, director, view } from "cc";
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

  private summaryLabel: Label | null = null;
  private homeButton: Button | null = null;

  protected onLoad(): void {
    this.ensureUi();
    this.replayButton?.node?.on(Button.EventType.CLICK, this.onReplayClicked, this);
    this.homeButton?.node?.on(Button.EventType.CLICK, this.onHomeClicked, this);
    this.refresh();
  }

  protected onDestroy(): void {
    this.replayButton?.node?.off(Button.EventType.CLICK, this.onReplayClicked, this);
    this.homeButton?.node?.off(Button.EventType.CLICK, this.onHomeClicked, this);
  }

  private refresh(): void {
    const gameManager = GameManager.getInstance();
    const result = gameManager.getLastPlayResult();
    const user = gameManager.getUser();

    if (this.rankLabel) {
      this.rankLabel.string = result?.rank === 1 ? "\uD83E\uDD47 You Win!" : result ? `\uD83C\uDFC1 Rank #${result.rank}` : "\uD83C\uDFC1 Rank: -";
    }
    if (this.rewardLabel) {
      this.rewardLabel.string = result ? `\uD83D\uDCB0 Reward: +${result.reward}` : "\uD83D\uDCB0 Reward: +0";
    }
    if (this.totalScoreLabel) {
      this.totalScoreLabel.string = `\uD83C\uDFC6 Score: ${user?.score ?? 0}`;
    }
    if (this.summaryLabel) {
      const tapCount = result?.tapCount ?? 0;
      const duration = result?.durationMs ? `${(result.durationMs / 1000).toFixed(1)}s` : "-";
      this.summaryLabel.string = result
        ? `Horse: #${(result.playerHorseId ?? 0) + 1}\nTaps: ${tapCount}\nTime: ${duration}`
        : "No race result yet";
    }
  }

  private onReplayClicked(): void {
    GameManager.getInstance().loadRace();
  }

  private onHomeClicked(): void {
    GameManager.getInstance().loadLobby();
  }

  private ensureUi(): void {
    const canvas = this.findInTree(director.getScene() ?? this.node, "Canvas") ?? this.node;
    const size = view.getVisibleSize();
    const scale = Math.min(size.width / 720, size.height / 1280) || 1;

    this.rankLabel = this.rankLabel ?? this.ensureLabel(canvas, "RankLabel", "\uD83C\uDFC1 Result", 40, new Vec3(0, 220 * scale, 0));
    this.rewardLabel = this.rewardLabel ?? this.ensureLabel(canvas, "RewardLabel", "\uD83D\uDCB0 Reward", 28, new Vec3(0, 120 * scale, 0));
    this.totalScoreLabel = this.totalScoreLabel ?? this.ensureLabel(canvas, "TotalScoreLabel", "\uD83C\uDFC6 Score", 28, new Vec3(0, 60 * scale, 0));
    this.summaryLabel = this.summaryLabel ?? this.ensureLabel(canvas, "SummaryLabel", "Loading result...", 24, new Vec3(0, -40 * scale, 0));
    this.replayButton = this.replayButton ?? this.ensureButton(canvas, "ReplayButton", "\uD83D\uDD01 Replay", new Vec3(0, -180 * scale, 0));
    this.homeButton = this.homeButton ?? this.ensureButton(canvas, "HomeButton", "\uD83C\uDFE0 Lobby", new Vec3(0, -270 * scale, 0));
  }

  private ensureLabel(parent: Node, name: string, text: string, fontSize: number, position: Vec3): Label {
    let node = this.findInTree(parent, name);
    if (!node) {
      node = new Node(name);
      node.setParent(parent);
    }

    node.setPosition(position);
    const transform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    transform.setContentSize(620, fontSize * 3);

    const label = node.getComponent(Label) ?? node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 10;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(255, 246, 163, 255);
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
    transform.setContentSize(220, 80);

    const label = node.getComponent(Label) ?? node.addComponent(Label);
    label.string = text;
    label.fontSize = 28;
    label.lineHeight = 34;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(214, 228, 255, 255);
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
