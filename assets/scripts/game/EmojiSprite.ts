import { _decorator, Component, Label, Color, Node, tween, Vec3 } from 'cc';
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
            const scale = this.fontSize / 100;
            this.node.setScale(scale, scale, scale);
        }
    }

    /**
     * 创建emoji动画
     * @param animationType 动画类型
     */
    public playAnimation(animationType: string): void {
        this.stopAnimation(); // 停止之前的动画

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
            case 'jump':
                this.playJumpAnimation();
                break;
            case 'fadeIn':
                this.playFadeInAnimation();
                break;
            case 'fadeOut':
                this.playFadeOutAnimation();
                break;
            case 'win':
                this.playWinAnimation();
                break;
            case 'lose':
                this.playLoseAnimation();
                break;
            default:
                console.warn(`未知的动画类型: ${animationType}`);
        }
    }

    /**
     * 弹跳动画
     */
    private playBounceAnimation(): void {
        tween(this.node)
            .to(0.1, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.1, { scale: new Vec3(0.9, 0.9, 1) })
            .to(0.1, { scale: new Vec3(1.1, 1.1, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    /**
     * 脉冲动画（呼吸效果）
     */
    private playPulseAnimation(): void {
        tween(this.node)
            .repeatForever(
                tween()
                    .to(0.5, { scale: new Vec3(1.1, 1.1, 1) })
                    .to(0.5, { scale: new Vec3(1, 1, 1) })
            )
            .start();
    }

    /**
     * 抖动动画
     */
    private playShakeAnimation(): void {
        const originalPos = this.node.position.clone();
        tween(this.node)
            .by(0.05, { position: new Vec3(10, 0, 0) })
            .by(0.05, { position: new Vec3(-20, 0, 0) })
            .by(0.05, { position: new Vec3(20, 0, 0) })
            .by(0.05, { position: new Vec3(-20, 0, 0) })
            .by(0.05, { position: new Vec3(10, 0, 0) })
            .call(() => {
                this.node.position = originalPos;
            })
            .start();
    }

    /**
     * 旋转动画
     */
    private playRotateAnimation(): void {
        tween(this.node)
            .by(1, { angle: 360 })
            .start();
    }

    /**
     * 跳跃动画
     */
    private playJumpAnimation(): void {
        const originalY = this.node.position.y;
        tween(this.node)
            .to(0.2, { position: new Vec3(this.node.position.x, originalY + 50, 0) })
            .to(0.2, { position: new Vec3(this.node.position.x, originalY, 0) })
            .start();
    }

    /**
     * 淡入动画
     */
    private playFadeInAnimation(): void {
        if (!this.label) return;
        
        this.label.color = new Color(255, 255, 255, 0);
        tween(this.label.color)
            .to(0.5, { a: 255 })
            .start();
    }

    /**
     * 淡出动画
     */
    private playFadeOutAnimation(): void {
        if (!this.label) return;
        
        tween(this.label.color)
            .to(0.5, { a: 0 })
            .start();
    }

    /**
     * 胜利动画（组合动画）
     */
    private playWinAnimation(): void {
        tween(this.node)
            .parallel(
                tween().by(0.5, { angle: 360 }),
                tween()
                    .to(0.25, { scale: new Vec3(1.5, 1.5, 1) })
                    .to(0.25, { scale: new Vec3(1, 1, 1) })
            )
            .start();
    }

    /**
     * 失败动画
     */
    private playLoseAnimation(): void {
        tween(this.node)
            .to(0.3, { scale: new Vec3(0.8, 0.8, 1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    /**
     * 停止所有动画
     */
    public stopAnimation(): void {
        tween(this.node).stop();
        if (this.label) {
            tween(this.label.color).stop();
        }
    }

    /**
     * 移动到指定位置（带动画）
     * @param targetPosition 目标位置
     * @param duration 持续时间（秒）
     */
    public moveTo(targetPosition: Vec3, duration: number = 1): void {
        tween(this.node)
            .to(duration, { position: targetPosition })
            .start();
    }

    /**
     * 改变颜色（带动画）
     * @param targetColor 目标颜色
     * @param duration 持续时间（秒）
     */
    public changeColor(targetColor: Color, duration: number = 0.5): void {
        if (!this.label) return;
        
        tween(this.label.color)
            .to(duration, { 
                r: targetColor.r,
                g: targetColor.g,
                b: targetColor.b,
                a: targetColor.a
            })
            .start();
    }

    /**
     * 缩放动画
     * @param targetScale 目标缩放
     * @param duration 持续时间（秒）
     */
    public scaleTo(targetScale: Vec3, duration: number = 0.5): void {
        tween(this.node)
            .to(duration, { scale: targetScale })
            .start();
    }
}