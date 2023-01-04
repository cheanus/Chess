/**
 * Predefined variables
 * Name = LayGrid
 * DateTime = Fri Apr 15 2022 22:43:01 GMT+0800 (中国标准时间)
 * Author = Qianxia1
 * FileBasename = LayGrid.ts
 * FileBasenameNoExtension = LayGrid
 * URL = db://assets/Script/LayGrid.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
 import { _decorator, Component, Node, Prefab, instantiate, GraphicsComponent, Vec3 } from 'cc';
 import { GridTS } from './GridTS';
 const { ccclass, property } = _decorator;


@ccclass('LayGrid')
export class LayGrid extends Component {
    @property({type: Prefab})
    public gridPre : Prefab | null = null;
    @property({type: GraphicsComponent})
    public canvasGraphics : GraphicsComponent | null = null;
    @property({type: Node})
    public particle : Node | null = null;
    private _boardSize : number = 7; // 棋盘大小
    private _gridSingle : Node | null = null; 
    private _gridTS : GridTS | null = null;
    public chosenGrid : Node | null = null; // 所选格
    private _lastGrid : Node | null = null; // 上次所下格
    public isMove : boolean = false; // 是否处于移动动画时期
    private _moveVector = new Vec3(); // 移动的方向向量
    private _curMoveTime : number = 0; // 移动动画进行时刻
    private _curMovePos = new Vec3(); // 移动动画实施坐标
    private _deltaVector = new Vec3(); // 移动动画差分向量

    start () {
        for(let i = 0;i < this._boardSize;i ++) {
            for(let j = 0;j < this._boardSize;j ++) {
                this._gridSingle = instantiate(this.gridPre);
                this._gridTS = this._gridSingle.getComponentInChildren(GridTS);
                this._gridTS.setXY(i, j);
                this.node.addChild(this._gridSingle);
            }
        } // 添加格子

    }

    setChosenGrid (chosenGrid : Node) {
        if(chosenGrid) { // 选好
            if(this.chosenGrid) { // 不是第一次选
                this.chosenGrid.getComponent(GridTS).setNormal();
            }
            this.chosenGrid = chosenGrid;
        } else { // 下好
            if(this._lastGrid) { // 不是第一次下
                this.canvasGraphics.moveTo(this._lastGrid.parent.position.x, this._lastGrid.parent.position.y);
                Vec3.subtract(this._moveVector, this.chosenGrid.parent.position, this._lastGrid.parent.position);
                this._curMoveTime = 0;
                this._curMovePos = this._lastGrid.parent.position;
                this.particle.setPosition(this._curMovePos);
                console.log(this._curMovePos);
                this.particle.active = true;
                this.isMove = true;
            } else { // 第一次下
                this.chosenGrid.getComponent(GridTS).setOccupied();
                this._lastGrid = this.chosenGrid;
                this.chosenGrid = null;
            }
        }
    }

    update (deltaTime: number) {
        if(this.isMove && this._curMoveTime <= 2/3) {
            this._curMoveTime += deltaTime;
            Vec3.multiplyScalar(this._deltaVector, this._moveVector, deltaTime * 1.5);
            Vec3.add(this._curMovePos, this._curMovePos, this._deltaVector);
            this.canvasGraphics.lineTo(this._curMovePos.x, this._curMovePos.y);
            this.canvasGraphics.stroke();
            this.particle.setPosition(this._curMovePos);
        } // 加载移动动画
        else if(this._curMoveTime > 2/3) {
            this.isMove = false;
            this.chosenGrid.getComponent(GridTS).setOccupied();
            this.chosenGrid = null;
            this._curMoveTime = 0;
            this.particle.active = false;
        } // 结束移动动画
    }
}
