import { _decorator, Button, Color, Component, Label, Node, UITransform, Vec3, director, view } from "cc";
import type { IUser } from "../model/UserModel";
import { GameManager } from "../core/GameManager";
import { AuthService } from "../network/AuthService";

const { ccclass, property } = _decorator;

@ccclass("LobbyUI")
export class LobbyUI extends Component {
  @property(Label)
  public usernameLabel: Label | null = null;

  @property(Label)
  public scoreLabel: Label | null = null;

  @property(Button)
  public startButton: Button | null = null;

  private hintLabel: Label | null = null;

  protected onLoad(): void {
    this.ensureUi();
    this.startButton?.node?.on(Button.EventType.CLICK, this.onStartClicked, this);
    if (this.startButton) {
      this.startButton.interactable = false;
    }
    this.setLoadingState();
    void this.bootstrapUser();
  }

  protected onDestroy(): void {
    this.startButton?.node?.off(Button.EventType.CLICK, this.onStartClicked, this);
  }

  public init(user: IUser): void {
    if (this.usernameLabel) {
      this.usernameLabel.string = `\uD83D\uDC0E ${user.username}`;
    }
    if (this.scoreLabel) {
      this.scoreLabel.string = `\uD83C\uDFC6 Score: ${user.score}`;
    }
    if (this.hintLabel) {
      this.hintLabel.string = "\uD83C\uDFC7 You ride horse #1. Tap fast to sprint.";
    }
  }

  private ensureUi(): void {
    const canvas = this.findInTree(director.getScene() ?? this.node, "Canvas") ?? this.node;
    const size = view.getVisibleSize();
    const scale = Math.min(size.width / 720, size.height / 1280) || 1;

    const titleLabel = this.ensureLabel(canvas, "TitleLabel", "\uD83C\uDFC7 Tap Horse", 44, new Vec3(0, 260 * scale, 0));
    titleLabel.color = new Color(255, 246, 163, 255);

    const heroLabel = this.ensureLabel(
      canvas,
      "HeroEmoji",
      "\uD83C\uDFC7  \uD83D\uDC0E  \uD83E\uDD84  \uD83E\uDD93",
      54,
      new Vec3(0, 140 * scale, 0)
    );
    heroLabel.color = new Color(255, 255, 255, 255);

    this.usernameLabel = this.usernameLabel ?? this.ensureLabel(canvas, "UsernameLabel", "Connecting to Telegram", 30, new Vec3(0, 45 * scale, 0));
    this.scoreLabel = this.scoreLabel ?? this.ensureLabel(canvas, "ScoreLabel", "Emoji Derby in TMA", 24, new Vec3(0, -10 * scale, 0));
    this.hintLabel = this.hintLabel ?? this.ensureLabel(
      canvas,
      "HintLabel",
      "\uD83D\uDC46 Tap the screen and beat 5 AI horses.",
      22,
      new Vec3(0, -95 * scale, 0)
    );
    this.startButton = this.startButton ?? this.ensureButton(canvas, "StartButton", "\uD83C\uDFC1 Start Race", new Vec3(0, -220 * scale, 0));
  }

  private setLoadingState(): void {
    if (this.usernameLabel) {
      this.usernameLabel.string = "\uD83D\uDC34 Horse Lobby";
    }
    if (this.scoreLabel) {
      this.scoreLabel.string = "\uD83D\uDD04 Connecting...";
    }
    if (this.hintLabel) {
      this.hintLabel.string = "Login first, then enter the emoji track.";
    }
  }

  private async bootstrapUser(): Promise<void> {
    try {
      const debugInitData = this.getDebugInitData();
      const user = await AuthService.authenticate(debugInitData);
      GameManager.getInstance().setUser(user);
      this.init(user);
      if (this.startButton) {
        this.startButton.interactable = true;
      }
    } catch {
      if (this.usernameLabel) {
        this.usernameLabel.string = "\u26A0\uFE0F Login failed";
      }
      if (this.scoreLabel) {
        this.scoreLabel.string = "\uD83D\uDCF1 Open in Telegram or set debug_init_data";
      }
      if (this.hintLabel) {
        this.hintLabel.string = "\uD83C\uDFC7 Local mode enabled. Tap to start racing.";
      }
      if (this.startButton) {
        this.startButton.interactable = true;
        const label = this.startButton.node.getComponent(Label);
        if (label) {
          label.string = "\uD83C\uDFC1 Start Race";
        }
      }
    }
  }

  private getDebugInitData(): string | undefined {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("debug_init_data");
    if (fromQuery) {
      return fromQuery;
    }

    const fromLocalStorage = window.localStorage.getItem("debug_init_data");
    return fromLocalStorage || undefined;
  }

  private onStartClicked(): void {
    if (!this.startButton || !this.startButton.interactable) {
      return;
    }

    this.startButton.interactable = false;
    GameManager.getInstance().loadRace();
  }

  private ensureLabel(parent: Node, name: string, text: string, fontSize: number, position: Vec3): Label {
    let node = this.findInTree(parent, name);
    if (!node) {
      node = new Node(name);
      node.setParent(parent);
    }

    node.setPosition(position);
    const transform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    transform.setContentSize(620, fontSize + 24);

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
    transform.setContentSize(280, 96);

    const label = node.getComponent(Label) ?? node.addComponent(Label);
    label.string = text;
    label.fontSize = 30;
    label.lineHeight = 38;
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
