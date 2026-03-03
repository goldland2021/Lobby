import { _decorator, Component, Node, director } from "cc";
import type { IUser } from "../model/UserModel";
import type { PlayResult } from "../types/ApiTypes";
const { ccclass } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  private static instance: GameManager | null = null;

  private currentUser: IUser | null = null;
  private lastPlayResult: PlayResult | null = null;

  public static getInstance(): GameManager {
    if (!this.instance) {
      const node = new Node("GameManager");
      const scene = director.getScene();
      if (scene) {
        scene.addChild(node);
      }
      const manager = node.addComponent(GameManager);
      if (node.parent) {
        director.addPersistRootNode(node);
      } else {
        console.warn("[GameManager] Skip persist: node is not under scene root yet");
      }
      this.instance = manager;
    }
    return this.instance;
  }

  protected onLoad(): void {
    if (GameManager.instance && GameManager.instance !== this) {
      this.node.destroy();
      return;
    }

    GameManager.instance = this;
    if (this.node.parent) {
      director.addPersistRootNode(this.node);
    } else {
      console.warn("[GameManager] Skip persist in onLoad: node is not under scene root");
    }
  }

  public setUser(user: IUser): void {
    this.currentUser = { ...user };
  }

  public getUser(): IUser | null {
    return this.currentUser ? { ...this.currentUser } : null;
  }

  public setLastPlayResult(result: PlayResult): void {
    this.lastPlayResult = { ...result, ranks: [...result.ranks] };
    if (this.currentUser) {
      this.currentUser.score = result.newScore;
      this.currentUser.totalGames += 1;
      if (result.rank === 1) {
        this.currentUser.winCount += 1;
      }
    }
  }

  public getLastPlayResult(): PlayResult | null {
    if (!this.lastPlayResult) {
      return null;
    }
    return { ...this.lastPlayResult, ranks: [...this.lastPlayResult.ranks] };
  }

  public loadLobby(): void {
    this.loadSceneSafe("LobbyScene");
  }

  public loadRace(): void {
    this.loadSceneSafe("RaceScene");
  }

  public loadResult(): void {
    this.loadSceneSafe("ResultScene");
  }

  private loadSceneSafe(sceneName: string): void {
    director.loadScene(sceneName, (error) => {
      if (error) {
        console.error(`[GameManager] Failed to load scene: ${sceneName}`, error);
      } else {
        console.log(`[GameManager] Scene loaded: ${sceneName}`);
      }
    });
  }
}
