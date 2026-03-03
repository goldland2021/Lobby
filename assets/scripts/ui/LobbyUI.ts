import { _decorator, Button, Component, Label, Node, director } from "cc";
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
    this.ensureStartButtonText();
    this.startButton?.node?.on(Button.EventType.CLICK, this.onStartClicked, this);
    if (this.startButton) {
      this.startButton.interactable = false;
    }
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
    if (!this.startButton) {
      return;
    }
    const labelNode = this.findInTree(this.startButton.node, "Label");
    const label = labelNode?.getComponent(Label) ?? null;
    if (!label) {
      return;
    }
    if (!label.string || label.string.toLowerCase() === "button") {
      label.string = "Start";
    }
  }

  public init(user: IUser): void {
    if (this.usernameLabel) {
      this.usernameLabel.string = user.username;
    }
    if (this.scoreLabel) {
      this.scoreLabel.string = `${user.score}`;
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
        this.usernameLabel.string = "Login failed";
      }
      if (this.scoreLabel) {
        this.scoreLabel.string = "Open in Telegram or set debug_init_data";
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
