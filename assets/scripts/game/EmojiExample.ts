import { _decorator, Component, Node, Color } from 'cc';
import { EmojiSprite } from './EmojiSprite';
import { EmojiManager } from './EmojiManager';
const { ccclass, property } = _decorator;

@ccclass('EmojiExample')
export class EmojiExample extends Component {
    @property(Node)
    private emojiContainer: Node | null = null;

    private emojiManager: EmojiManager | null = null;
    private createdEmojis: EmojiSprite[] = [];

    protected onLoad(): void {
        this.emojiManager = EmojiManager.getInstance();
        
        // 延迟执行示例，确保所有组件加载完成
        this.scheduleOnce(() => {
            this.runExamples();
        }, 1);
    }

    /**
     * 运行所有示例
     */
    private runExamples(): void {
        if (!this.emojiContainer || !this.emojiManager) return;

        console.log('🚀 开始运行emoji动画示例');

        // 示例1: 创建基本emoji
        this.example1_BasicEmoji();
        
        // 示例2: 创建赛马场景
        setTimeout(() => {
            this.example2_RaceScene();
        }, 3000);
        
        // 示例3: 动画演示
        setTimeout(() => {
            this.example3_Animations();
        }, 6000);
        
        // 示例4: 特效演示
        setTimeout(() => {
            this.example4_Effects();
        }, 9000);
    }

    /**
     * 示例1: 创建基本emoji
     */
    private example1_BasicEmoji(): void {
        if (!this.emojiContainer || !this.emojiManager) return;

        console.log('📝 示例1: 创建基本emoji');
        
        // 创建各种类型的emoji
        const positions = [
            { x: -300, y: 200 },
            { x: -100, y: 200 },
            { x: 100, y: 200 },
            { x: 300, y: 200 },
        ];

        // 创建UI元素
        const uiEmoji = this.emojiManager.createUIElement('PLAY', this.emojiContainer, positions[0]);
        if (uiEmoji) {
            uiEmoji.playAnimation('pulse');
            this.createdEmojis.push(uiEmoji);
        }

        // 创建表情
        const expressionEmoji = this.emojiManager.createExpression('HAPPY', this.emojiContainer, positions[1]);
        if (expressionEmoji) {
            expressionEmoji.playAnimation('bounce');
            this.createdEmojis.push(expressionEmoji);
        }

        // 创建特效
        const effectEmoji = this.emojiManager.createEffect('SPARKLES', this.emojiContainer, positions[2]);
        if (effectEmoji) {
            effectEmoji.playAnimation('rotate');
            this.createdEmojis.push(effectEmoji);
        }

        // 创建赛马
        const horseEmoji = this.emojiManager.createHorse('RED', this.emojiContainer, positions[3]);
        if (horseEmoji) {
            horseEmoji.playAnimation('jump');
            this.createdEmojis.push(horseEmoji);
        }
    }

    /**
     * 示例2: 创建赛马场景
     */
    private example2_RaceScene(): void {
        if (!this.emojiContainer || !this.emojiManager) return;

        console.log('🏇 示例2: 创建赛马场景');
        
        // 清空之前的emoji
        this.clearCreatedEmojis();
        
        // 创建完整的赛马场景
        this.emojiManager.createRaceScene(this.emojiContainer);
        
        // 创建奖杯
        const trophy = this.emojiManager.createTrackElement('TROPHY', this.emojiContainer, { x: 450, y: 0 });
        if (trophy) {
            trophy.playAnimation('pulse');
            this.createdEmojis.push(trophy);
        }
    }

    /**
     * 示例3: 动画演示
     */
    private example3_Animations(): void {
        if (!this.emojiContainer || !this.emojiManager) return;

        console.log('🎬 示例3: 动画演示');
        
        // 清空之前的emoji
        this.clearCreatedEmojis();
        
        const animations = ['bounce', 'shake', 'rotate', 'jump', 'pulse'];
        const startX = -400;
        const spacing = 200;
        
        // 创建多个emoji，每个演示不同的动画
        animations.forEach((animation, index) => {
            const x = startX + (index * spacing);
            const emoji = this.emojiManager.createEmoji('🐎', this.emojiContainer, { x, y: 0 }, 80);
            
            if (emoji) {
                // 设置不同颜色
                const colors = [
                    new Color(255, 100, 100, 255), // 红
                    new Color(100, 255, 100, 255), // 绿
                    new Color(100, 100, 255, 255), // 蓝
                    new Color(255, 255, 100, 255), // 黄
                    new Color(255, 100, 255, 255), // 紫
                ];
                
                emoji.setTextColor(colors[index]);
                emoji.playAnimation(animation);
                
                // 添加说明文字
                const labelNode = new Node(`Label_${animation}`);
                labelNode.parent = this.emojiContainer;
                labelNode.setPosition(x, -100);
                // 这里可以添加Label组件显示动画名称
                
                this.createdEmojis.push(emoji);
            }
        });
    }

    /**
     * 示例4: 特效演示
     */
    private example4_Effects(): void {
        if (!this.emojiContainer || !this.emojiManager) return;

        console.log('✨ 示例4: 特效演示');
        
        // 清空之前的emoji
        this.clearCreatedEmojis();
        
        // 创建胜利特效
        this.emojiManager.createWinEffect(this.emojiContainer, { x: 0, y: 0 });
        
        // 创建多个特效emoji
        const effects: Array<keyof typeof EmojiManager.EFFECT_EMOJIS> = ['FIRE', 'SPARKLES', 'CONFETTI', 'RAINBOW', 'LIGHTNING'];
        const radius = 150;
        
        effects.forEach((effect, index) => {
            const angle = (index / effects.length) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const effectEmoji = this.emojiManager.createEffect(effect, this.emojiContainer, { x, y });
            if (effectEmoji) {
                // 不同的动画效果
                const animations = ['rotate', 'pulse', 'bounce', 'shake', 'jump'];
                effectEmoji.playAnimation(animations[index]);
                
                // 颜色变化
                setTimeout(() => {
                    const colors = [
                        new Color(255, 50, 50, 255),   // 红
                        new Color(255, 255, 100, 255), // 黄
                        new Color(100, 255, 100, 255), // 绿
                        new Color(100, 200, 255, 255), // 蓝
                        new Color(255, 100, 255, 255), // 紫
                    ];
                    effectEmoji.changeColor(colors[index], 1);
                }, 1000);
                
                this.createdEmojis.push(effectEmoji);
            }
        });
    }

    /**
     * 清空创建的emoji
     */
    private clearCreatedEmojis(): void {
        if (this.emojiManager) {
            this.createdEmojis.forEach(emoji => {
                this.emojiManager!.recycleEmoji(emoji);
            });
        }
        this.createdEmojis = [];
    }

    /**
     * 测试按钮：运行所有示例
     */
    public runAllExamples(): void {
        this.clearCreatedEmojis();
        this.runExamples();
    }

    /**
     * 测试按钮：清空所有emoji
     */
    public clearAll(): void {
        this.clearCreatedEmojis();
        if (this.emojiManager) {
            this.emojiManager.clearAllEmojis();
        }
    }

    /**
     * 测试按钮：创建赛马比赛
     */
    public createRace(): void {
        this.clearCreatedEmojis();
        if (this.emojiContainer && this.emojiManager) {
            this.emojiManager.createRaceScene(this.emojiContainer);
        }
    }

    /**
     * 测试按钮：创建胜利特效
     */
    public createWinEffect(): void {
        if (this.emojiContainer && this.emojiManager) {
            this.emojiManager.createWinEffect(this.emojiContainer, { x: 0, y: 0 });
        }
    }

    protected onDestroy(): void {
        this.clearCreatedEmojis();
    }
}