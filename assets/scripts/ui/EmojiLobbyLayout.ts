import { _decorator, Component, Node, director } from "cc";
import { EmojiManager } from "../game/EmojiManager";

const { ccclass, property } = _decorator;

@ccclass("EmojiLobbyLayout")
export class EmojiLobbyLayout extends Component {
  @property(Node)
  public emojiRoot: Node | null = null;

  protected onLoad(): void {
    const root = this.emojiRoot ?? this.node;

    try {
      const manager = EmojiManager.getInstance();
      manager.createLobbyScene(root);
    } catch (error) {
      const sceneName = director.getScene()?.name ?? "UnknownScene";
      // eslint-disable-next-line no-console
      console.warn(`[EmojiLobbyLayout] EmojiManager is not initialized in scene "${sceneName}".`, error);
    }
  }
}
