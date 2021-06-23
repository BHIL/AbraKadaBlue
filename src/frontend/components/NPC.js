import React from 'react';
import classNames from 'classnames/bind';

export default class NPC extends React.Component {
    constructor(props) {
        super(props);

        this.animationRef = React.createRef();

        this.state = {
            animation_step: 0,
            is_unlocking: props.is_unlocking,
        }

        this.is_animated = false;
    }

    get_graphics() {
        if (this.props.is_locked || this.props.is_unlocking) {
            return this.props.npc.locked_graphics;
        }
        return this.props.npc.graphics;
    }

    componentDidMount() {
        this.start_animation_loop();
    }

    start_animation_loop() {
        if (!this.props.npc.graphics) {
            return;
        }
        
        const animation_loop = this.get_graphics().animation_loop;
    
        const last_step = animation_loop[animation_loop.length - 1];
        
        // Set starting position to the end of the animation loop
        this.$element = $(this.animationRef.current).css({
            zIndex: last_step.y,
            top: last_step.y,
            left: last_step.x,
        })
        
        // Start animation loop
        this.animate_step(0);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.is_unlocking == false && state.is_unlocking) {
            if (this.is_animated) {
                this.$element.stop();
                this.is_animated = false;
            }
            this.start_animation_loop();

            return {is_unlocking: props.is_unlocking};
        }

        return null;
    }

    animate_step(i) {
        this.is_animated = true;
        
        if (!this.props.npc.graphics) {
            console.error('NPC with not graphics');
            return;
        }

        const animation_loop = this.get_graphics().animation_loop;

        const height = this.$element.height() * 0.82;
        this.$element
            .animate({
                top: animation_loop[i].y,
                left: animation_loop[i].x
            }, {
                duration: animation_loop[i].duration,
                easing: 'linear',
                complete: this.animate_step.bind(this, (i + 1) % animation_loop.length),
                step: function(now, fx) {
                    if (fx.prop == 'top') {
                        this.style.zIndex = (now + height).toFixed();
                    }
                }
            });
        
        // Save the current animation class so we will be able to remove it
        this.setState({animation_step: i});
    }

    render() {
        if (this.props.is_paused) {
            if (this.is_animated) {
                this.$element.stop();
                this.is_animated = false;
            }
        }
        else {
            if (this.$element && !this.is_animated) {
                setTimeout(() => {
                    this.animate_step(this.state.animation_step);
                });
            }
        }
        const graphics = this.get_graphics();

        return (
            <div className={classNames('npc', graphics?.sprite, graphics?.animation_loop[this.state.animation_step].animation)} ref={this.animationRef} data-npc-id={this.props.npc.id} />
        );
    }
}
