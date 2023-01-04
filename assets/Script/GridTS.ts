
import { _decorator, Component, Node, SpriteComponent, Color, find } from 'cc';
import { LayGrid } from './LayGrid';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GridTS
 * DateTime = Sat Apr 16 2022 14:53:58 GMT+0800 (中国标准时间)
 * Author = Qianxia1
 * FileBasename = GridTS.ts
 * FileBasenameNoExtension = GridTS
 * URL = db://assets/Script/GridTS.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
enum ButtonState {
    BC_NORMAL,
    BC_CHOSEN,
    BC_OCCUPIED
}

@ccclass('GridTS')
export class GridTS extends Component {

    @property({type: Node})
    public edge : Node | null = null;
    private chessBoardTS : LayGrid | null = null;
    private i : number | null = null;
    private j : number | null = null;
    // public x : number | null = null;
    // public y : number | null = null;
    private _buttonState : ButtonState | null = ButtonState.BC_NORMAL;
    private _buttonSprite : SpriteComponent | null = null;

    start () {
        this._buttonSprite = this.node.getComponent(SpriteComponent);
        this.chessBoardTS = find("Canvas/Chessboard").getComponent(LayGrid);
        // this.x = this.node.parent.position.x;
        // this.y = this.node.parent.position.y;
    }

    setXY(i : number, j : number) {
        this.i = i;
        this.j = j;
    }

    onGridDown() {
        // console.log(this.node.parent.position); 调试用
        if(this.chessBoardTS.isMove) {
            return;
        }
        switch(this._buttonState) {
            case ButtonState.BC_NORMAL:
                this.edge.active = true;
                this.chessBoardTS.setChosenGrid(this.node);
                this._buttonState = ButtonState.BC_CHOSEN;
                break;
            case ButtonState.BC_CHOSEN:
                this.edge.active = false;
                this.chessBoardTS.setChosenGrid(null);
                break;
            case ButtonState.BC_OCCUPIED:
                // this._buttonSprite.color = new Color(228,235,147,255);
                break;
        }
    }

    setNormal() {
        this.edge.active = false;
        this._buttonState = ButtonState.BC_NORMAL;
    }

    setOccupied() {
        this._buttonSprite.color = Color.RED;
        this._buttonState = ButtonState.BC_OCCUPIED;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
