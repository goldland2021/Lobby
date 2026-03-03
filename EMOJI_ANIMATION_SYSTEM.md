import { _decorator, Component, Label, Color, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EmojiSprite')
export class EmojiSprite extends Component {
    @property(Label)
    private label: Label | null = null;

    @property
    private emoji: string = '🐎';

    @property
    private fontSize: number = 100;

    @property(Color)
    private textColor: Color = new Color(255, 255, 255, 255);

    @property
    private autoSize: boolean = true;

    protected onLoad(): void {
        if (!this.label) {
            this.label = this.getComponent(Label);
            if (!this.label) {
                this.label = this.addComponent(Label);
            }
        }

        this.updateEmoji();
    }

    /**
     * 设置显示的emoji
     * @param emoji emoji字符
     */
    public setEmoji(emoji: string): void {
        this.emoji = emoji;
        this.updateEmoji();
    }

    /**
     * 获取当前emoji
     */
    public getEmoji(): string {
        return this.emoji;
    }

    /**
     * 设置字体大小
     * @param size 字体大小
     */
    public setFontSize(size: number): void {
        this.fontSize = size;
        this.updateEmoji();
    }

    /**
     * 设置文字颜色
     * @param color 颜色
     */
    public setTextColor(color: Color): void {
        this.textColor = color;
        this.updateEmoji();
    }

    /**
     * 更新emoji显示
     */
    private updateEmoji(): void {
        if (!this.label) return;

        this.label.string = this.emoji;
        this.label.fontSize = this.fontSize;
        this.label.color = this.textColor;
        
        if (this.autoSize) {
            // 根据字体大小自动调整节点大小
            this.node.setScale(this.fontSize / 100, this.fontSize / 100);
        }
    }

    /**
     * 创建emoji动画
     * @param animationType 动画类型
     */
    public playAnimation(animationType: string): void {
        switch (animationType) {
            case 'bounce':
                this.playBounceAnimation();
                break;
            case 'pulse':
                this.playPulseAnimation();
                break;
            case 'shake':
                this.playShakeAnimation();
                break;
            case 'rotate':
                this.playRotateAnimation();
                break;
            default:
                console.warn(`未知的动画类型: ${animationType}`);
        }
    }

    /**
     * 弹跳动画
     */
    private playBounceAnimation(): void {
        // 简单的弹跳动画
        this.node.scale = cc.v3(1, 1, 1);
        cc.tween(this.node)
            .to(0.1, { scale: cc.v3(1.2, 1.2, 1) })
            .to(0.1, { scale: cc.v3(0.9, 0.9, 1) })
            .to(0.1, { scale: cc.v3(1.1, 1.1, 1) })
            .to(0.1, { scale: cc.v3(1, 1, 1) })
            .start();
    }

    /**
     * 脉冲动画
     */
    private playPulseAnimation(): void {
        cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .to(0.5, { scale: cc.v3(1.1, 1.1, 1) })
                    .to(0.5, { scale: cc.v3(1, 1, 1) })
            )
            .start();
    }

    /**
     * 抖动动画
     */
    private playShakeAnimation(): void {
        const originalPos = this.node.position.clone();
        cc.tween(this.node)
            .by(0.05, { position: cc.v3(10, 0, 0) })
            .by(0.05, { position: cc.v3(-20, 0, 0) })
            .by(0.05, { position: cc.v3(20, 0, 0) })
            .by(0.05, { position: cc.v3(-20, 0, 0) })
            .by(0.05, { position: cc.v3(10, 0, 0) })
            .call(() => {
                this.node.position = originalPos;
            })
            .start();
    }

    /**
     * 旋转动画
     */
    private playRotateAnimation(): void {
        cc.tween(this.node)
            .by(1, { angle: 360 })
            .start();
    }

    /**
     * 停止所有动画
     */
    public stopAnimation(): void {
        cc.Tween.stopAllByTarget(this.node);
    }
}