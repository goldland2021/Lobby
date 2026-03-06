import { _decorator, Component, Node, Prefab, instantiate, Label, Color } from 'cc';
import { EmojiSprite } from './EmojiSprite';
const { ccclass, property } = _decorator;

@ccclass('EmojiManager')
export class EmojiManager extends Component {
    private static instance: EmojiManager | null = null;

    // 赛马相关的emoji
    public static readonly HORSE_EMOJIS = {
        RED: '🐎',      // 红马
        BLUE: '🦄',     // 蓝马（独角兽）
        GREEN: '🐴',    // 绿马
        YELLOW: '🏇',   // 黄马（赛马骑手）
        PURPLE: '🦓',   // 紫马（斑马）
        ORANGE: '🐖',   // 橙马（猪，搞笑用）
    };

    // 赛道元素emoji
    public static readonly TRACK_EMOJIS = {
        START: '🚩',    // 起点旗
        FINISH: '🏁',   // 终点旗
        FLAG: '🎌',     // 旗帜
        TROPHY: '🏆',   // 奖杯
        MEDAL: '🏅',    // 奖牌
    };

    // UI元素emoji
    public static readonly UI_EMOJIS = {
        PLAY: '▶️',     // 播放/开始
        PAUSE: '⏸️',    // 暂停
        SETTINGS: '⚙️', // 设置
        EXIT: '🚪',     // 退出
        HOME: '🏠',     // 主页
        BACK: '🔙',     // 返回
        NEXT: '⏭️',     // 下一个
        RELOAD: '🔄',   // 重新加载
        STAR: '⭐',     // 星星
        HEART: '❤️',    // 爱心
        COIN: '🪙',     // 硬币
        TROPHY: '🏆',   // 奖杯
    };

    // 表情emoji
    public static readonly EXPRESSION_EMOJIS = {
        HAPPY: '😊',
        SAD: '😢',
        ANGRY: '😠',
        SURPRISE: '😲',
        LAUGH: '😂',
        WINK: '😉',
        COOL: '😎',
        LOVE: '😍',
    };

    // 特效emoji
    public static readonly EFFECT_EMOJIS = {
        FIRE: '🔥',
        SPARKLES: '✨',
        CONFETTI: '🎉',
        RAINBOW: '🌈',
        LIGHTNING: '⚡',
        SNOW: '❄️',
        SUN: '☀️',
        MOON: '🌙',
        STAR: '🌟',
        HEART: '💖',
    };

    @property(Prefab)
    private emojiPrefab: Prefab | null = null;

    private emojiPool: EmojiSprite[] = [];

    protected onLoad(): void {
        if (!EmojiManager.instance) {
            EmojiManager.instance = this;
        }
    }

    protected onDestroy(): void {
        if (EmojiManager.instance === this) {
            EmojiManager.instance = null;
        }
    }

    /**
     * 获取单例实例
     */
    public static getInstance(): EmojiManager {
        if (!EmojiManager.instance) {
            console.error('EmojiManager实例未初始化');
        }
        return EmojiManager.instance!;
    }

    /**
     * 创建emoji精灵
     * @param emoji emoji字符
     * @param parent 父节点
     * @param position 位置
     * @param fontSize 字体大小
     */
    public createEmoji(
        emoji: string, 
        parent: Node, 
        position: { x: number, y: number } = { x: 0, y: 0 },
        fontSize: number = 100
    ): EmojiSprite | null {
        let emojiSprite: EmojiSprite | null = null;

        // 尝试从池中获取
        if (this.emojiPool.length > 0) {
            emojiSprite = this.emojiPool.pop()!;
            emojiSprite.node.parent = parent;
            emojiSprite.node.active = true;
        } 
        // 或者创建新的
        else if (this.emojiPrefab) {
            const node = instantiate(this.emojiPrefab);
            node.parent = parent;
            emojiSprite = node.getComponent(EmojiSprite);
        }
        // 或者动态创建
        else {
            const node = new Node('EmojiSprite');
            node.parent = parent;
            emojiSprite = node.addComponent(EmojiSprite);
        }

        if (emojiSprite) {
            emojiSprite.node.setPosition(position.x, position.y);
            emojiSprite.setEmoji(emoji);
            emojiSprite.setFontSize(fontSize);
        }

        return emojiSprite;
    }

    /**
     * 创建赛马emoji
     * @param horseColor 马的颜色
     * @param parent 父节点
     * @param position 位置
     */
    public createHorse(
        horseColor: keyof typeof EmojiManager.HORSE_EMOJIS,
        parent: Node,
        position: { x: number, y: number } = { x: 0, y: 0 }
    ): EmojiSprite | null {
        const emoji = EmojiManager.HORSE_EMOJIS[horseColor];
        return this.createEmoji(emoji, parent, position, 80);
    }

    /**
     * 创建赛道元素
     * @param trackElement 赛道元素类型
     * @param parent 父节点
     * @param position 位置
     */
    public createTrackElement(
        trackElement: keyof typeof EmojiManager.TRACK_EMOJIS,
        parent: Node,
        position: { x: number, y: number } = { x: 0, y: 0 }
    ): EmojiSprite | null {
        const emoji = EmojiManager.TRACK_EMOJIS[trackElement];
        return this.createEmoji(emoji, parent, position, 60);
    }

    /**
     * 创建UI按钮emoji
     * @param uiElement UI元素类型
     * @param parent 父节点
     * @param position 位置
     */
    public createUIElement(
        uiElement: keyof typeof EmojiManager.UI_EMOJIS,
        parent: Node,
        position: { x: number, y: number } = { x: 0, y: 0 }
    ): EmojiSprite | null {
        const emoji = EmojiManager.UI_EMOJIS[uiElement];
        return this.createEmoji(emoji, parent, position, 50);
    }

    /**
     * 创建表情emoji
     * @param expression 表情类型
     * @param parent 父节点
     * @param position 位置
     */
    public createExpression(
        expression: keyof typeof EmojiManager.EXPRESSION_EMOJIS,
        parent: Node,
        position: { x: number, y: number } = { x: 0, y: 0 }
    ): EmojiSprite | null {
        const emoji = EmojiManager.EXPRESSION_EMOJIS[expression];
        return this.createEmoji(emoji, parent, position, 60);
    }

    /**
     * 创建特效emoji
     * @param effect 特效类型
     * @param parent 父节点
     * @param position 位置
     */
    public createEffect(
        effect: keyof typeof EmojiManager.EFFECT_EMOJIS,
        parent: Node,
        position: { x: number, y: number } = { x: 0, y: 0 }
    ): EmojiSprite | null {
        const emoji = EmojiManager.EFFECT_EMOJIS[effect];
        return this.createEmoji(emoji, parent, position, 40);
    }

    /**
     * 回收emoji精灵
     * @param emojiSprite emoji精灵
     */
    public recycleEmoji(emojiSprite: EmojiSprite): void {
        emojiSprite.stopAnimation();
        emojiSprite.node.active = false;
        emojiSprite.node.parent = null;
        this.emojiPool.push(emojiSprite);
    }

    /**
     * 创建赛马比赛场景
     * @param parent 父节点
     */
    public createRaceScene(parent: Node): void {
        // 创建起点旗
        this.createTrackElement('START', parent, { x: -400, y: 0 });
        
        // 创建终点旗
        this.createTrackElement('FINISH', parent, { x: 400, y: 0 });
        
        // 创建6匹赛马
        const horseColors = Object.keys(EmojiManager.HORSE_EMOJIS) as Array<keyof typeof EmojiManager.HORSE_EMOJIS>;
        const startY = 200;
        const spacing = 70;
        
        horseColors.forEach((color, index) => {
            const y = startY - (index * spacing);
            const horse = this.createHorse(color, parent, { x: -400, y });
            if (horse) {
                // 给每匹马一个独特的颜色
                const colors = [
                    new Color(255, 100, 100, 255), // 红
                    new Color(100, 100, 255, 255), // 蓝
                    new Color(100, 255, 100, 255), // 绿
                    new Color(255, 255, 100, 255), // 黄
                    new Color(255, 100, 255, 255), // 紫
                    new Color(255, 150, 50, 255),  // 橙
                ];
                horse.setTextColor(colors[index]);
            }
        });
    }

    /**
     * 创建极简风格的大厅场景
     * 使用少量emoji，突出赛马主题和开始按钮
     * @param parent 父节点（通常是Lobby场景中的一个容器节点）
     */
    public createLobbyScene(parent: Node): void {
        // 顶部欢迎表情
        const welcome = this.createExpression('HAPPY', parent, { x: 0, y: 200 });
        if (welcome) {
            welcome.setFontSize(80);
            welcome.playAnimation('pulse');
        }

        // 左上角：硬币图标，代表积分
        const coin = this.createUIElement('COIN', parent, { x: -260, y: 260 });
        if (coin) {
            coin.setFontSize(40);
        }

        // 右上角：奖杯图标，代表排行榜/成就
        const trophy = this.createUIElement('TROPHY', parent, { x: 260, y: 260 });
        if (trophy) {
            trophy.setFontSize(40);
        }

        // 中间：一匹静态赛马作为主视觉
        const mainHorse = this.createHorse('YELLOW', parent, { x: 0, y: 80 });
        if (mainHorse) {
            mainHorse.setFontSize(90);
        }

        // 开始按钮附近：播放符号emoji 做轻量装饰
        const playIcon = this.createUIElement('PLAY', parent, { x: 0, y: -20 });
        if (playIcon) {
            playIcon.setFontSize(48);
            playIcon.playAnimation('bounce');
        }
    }

    /**
     * 创建胜利特效
     * @param parent 父节点
     * @param position 位置
     */
    public createWinEffect(parent: Node, position: { x: number, y: number }): void {
        // 创建多个特效emoji
        const effects: Array<keyof typeof EmojiManager.EFFECT_EMOJIS> = ['CONFETTI', 'SPARKLES', 'FIRE', 'RAINBOW', 'STAR'];
        
        effects.forEach((effect, index) => {
            const angle = (index / effects.length) * Math.PI * 2;
            const radius = 100;
            const x = position.x + Math.cos(angle) * radius;
            const y = position.y + Math.sin(angle) * radius;
            
            const effectEmoji = this.createEffect(effect, parent, { x, y });
            if (effectEmoji) {
                effectEmoji.playAnimation('rotate');
                
                // 延迟后淡出
                setTimeout(() => {
                    effectEmoji.playAnimation('fadeOut');
                    setTimeout(() => {
                        this.recycleEmoji(effectEmoji);
                    }, 500);
                }, 1000 + index * 200);
            }
        });
    }

    /**
     * 清空所有emoji
     */
    public clearAllEmojis(): void {
        // 这里可以扩展为遍历所有创建的emoji并回收
        this.emojiPool.forEach(emoji => {
            if (emoji.node.parent) {
                emoji.node.parent = null;
            }
        });
        this.emojiPool = [];
    }
}