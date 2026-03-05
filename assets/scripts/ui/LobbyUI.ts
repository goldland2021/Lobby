import { _decorator, Button, Component, Label, Node, UITransform, director, view } from "cc";
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

  protected onLoad(): void {
    this.resolveReferences();
    this.applyDefaultLayoutIfOverlapped();
    this.applyMobileFriendlyStyle();
    this.ensureStartButtonText();
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

  private resolveReferences(): void {
    const root = director.getScene() ?? this.node;

    if (!this.usernameLabel) {
      const node = this.findInTree(root, "UsernameLabel");
      this.usernameLabel = node?.getComponent(Label) ?? null;
    }
    if (!this.scoreLabel) {
      const node = this.findInTree(root, "ScoreLabel");
      this.scoreLabel = node?.getComponent(Label) ?? null;
    }
    if (!this.startButton) {
      const node = this.findInTree(root, "StartButton");
      this.startButton = node?.getComponent(Button) ?? null;
    }

    if (!this.startButton || !this.usernameLabel || !this.scoreLabel) {
      console.warn("[LobbyUI] Missing references. Please bind in Inspector or keep node names: UsernameLabel/ScoreLabel/StartButton");
    }
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

  private applyDefaultLayoutIfOverlapped(): void {
    if (!this.usernameLabel || !this.scoreLabel || !this.startButton) {
      return;
    }

    const u = this.usernameLabel.node.position;
    const s = this.scoreLabel.node.position;
    const b = this.startButton.node.position;
    const sameSpot = u.x === s.x && u.y === s.y && s.x === b.x && s.y === b.y;
    if (!sameSpot) {
      return;
    }

    this.usernameLabel.node.setPosition(0, 120, 0);
    this.scoreLabel.node.setPosition(0, 60, 0);
    this.startButton.node.setPosition(0, -20, 0);
  }

  private ensureStartButtonText(): void {
    const label = this.getStartButtonLabel();
    if (!label) {
      return;
    }

    const normalized = (label.string || "").trim().toLowerCase();
    if (!normalized || normalized === "button" || normalized === "start") {
      label.string = "\uD83C\uDFC1 Start Race";
    }
  }

  private getStartButtonLabel(): Label | null {
    if (!this.startButton) {
      return null;
    }

    const labelNode = this.findInTree(this.startButton.node, "Label");
    return labelNode?.getComponent(Label) ?? null;
  }

  private applyMobileFriendlyStyle(): void {
    if (!this.usernameLabel || !this.scoreLabel || !this.startButton) {
      return;
    }

    const size = view.getVisibleSize();
    const shortSide = Math.min(size.width, size.height);
    const mobileScale = shortSide < 500 ? 1.35 : shortSide < 700 ? 1.2 : 1.0;

    const usernameFont = Math.round(30 * mobileScale);
    const scoreFont = Math.round(24 * mobileScale);
    this.usernameLabel.fontSize = usernameFont;
    this.usernameLabel.lineHeight = usernameFont + 12;
    this.scoreLabel.fontSize = scoreFont;
    this.scoreLabel.lineHeight = scoreFont + 10;

    const buttonLabel = this.getStartButtonLabel();
    if (buttonLabel) {
      const buttonFont = Math.round(28 * mobileScale);
      buttonLabel.fontSize = buttonFont;
      buttonLabel.lineHeight = buttonFont + 10;
    }

    const buttonTransform = this.startButton.node.getComponent(UITransform);
    if (buttonTransform) {
      buttonTransform.setContentSize(
        Math.round(220 * mobileScale),
        Math.round(78 * mobileScale)
      );
    }

    this.usernameLabel.node.setPosition(0, Math.round(150 * mobileScale), 0);
    this.scoreLabel.node.setPosition(0, Math.round(75 * mobileScale), 0);
    this.startButton.node.setPosition(0, Math.round(-45 * mobileScale), 0);
  }

  private setLoadingState(): void {
    if (this.usernameLabel) {
      this.usernameLabel.string = "\uD83D\uDC0E Horse Lobby";
    }
    if (this.scoreLabel) {
      this.scoreLabel.string = "\uD83D\uDD04 Connecting...";
    }
  }

  public init(user: IUser): void {
    if (this.usernameLabel) {
      this.usernameLabel.string = `\uD83D\uDC0E ${user.username}`;
    }
    if (this.scoreLabel) {
      this.scoreLabel.string = `\uD83C\uDFC6 Score: ${user.score}`;
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
    } catch (error: unknown) {
      if (this.usernameLabel) {
        this.usernameLabel.string = "\u26A0\uFE0F Login failed";
      }
      if (this.scoreLabel) {
        this.scoreLabel.string = "\uD83D\uDCF2 Open in Telegram or set debug_init_data";
      }
      if (this.startButton) {
        this.startButton.interactable = false;
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
}