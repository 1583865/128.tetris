"use strict";
//定义cell类型描述一个格子:r,c,src
class Cell{
    constructor(r,c,src){
        this.r=r;this.c=c;this.src=src;
    }
}
class State{
    constructor(r0,c0,r1,c1,r2,c2,r3,c3){
        this.r0=r0; this.c0=c0;
        this.r1=r1; this.c1=c1;
        this.r2=r2; this.c2=c2;
        this.r3=r3; this.c3=c3;
    }
}
class Shape{//创建一个类型
    constructor(r0,c0,r1,c1,r2,c2,r3,c3,src,states,orgi){
        this.cells=[
          new Cell(r0,c0,src),
          new Cell(r1,c1,src),
          new Cell(r2,c2,src),
          new Cell(r3,c3,src)
        ];
        this.states=states;
        this.orgCell=this.cells[orgi];
        this.statei=0;
    }
    moveDown(){
        //遍历当前图形的cells中每个cell
        for(var cell of this.cells){
          cell.r++;
        }
    }
    moveLeft(){
        //遍历当前图形的cells中每个cell
        for(var cell of this.cells){
          cell.c--;
        }
    }
    moveRight(){
        //遍历当前图形的cells中每个cell
        for(var cell of this.cells){
          cell.c++;
        }
    }
    rotate(){
        //获得statei状态的对象
        var state=this.states[this.statei];
        //遍历cells中每个格
        for(var i=0;i<this.cells.length;i++){
            if(this.cells[i]!=this.orgCell){
                this.cells[i].r=
                    this.orgCell.r+state["r"+i];
                this.cells[i].c=
                    this.orgCell.c+state["c"+i];
            }
        }
    }
    rotateR(){
        //将statei+1
        this.statei++;
        //如果statei越界，就返回0
        if(this.statei==this.states.length){this.statei=0}
        this.rotate();//旋转
    }
    rotateL(){
        //将statei-1
        this.statei--;
        //如果statei越界，就返回0
        if(this.statei==-1){
            this.statei= this.states.length-1
        }
        this.rotate();
    }
}

class T extends Shape{
    constructor(){
        super(0,3,0,4,0,5,1,4,"img/T.png",[
            new State(0,-1,0,0,0,+1,+1,0),
            new State(-1,0,0,0,+1,0,0,-1),
            new State(0,+1,0,0,0,-1,-1,0),
            new State(+1,0,0,0,-1,0,0,+1)
        ],1);
    }
}
class O extends Shape{
    constructor(){
        super(0,4,0,5,1,4,1,5,"img/O.png",[
            new State(0,-1,0,0,+1,-1,+1,0)
        ],1);
    }
}
class I extends Shape{
    constructor(){
        super(0,3,0,4,0,5,0,6,"img/I.png",[
            new State(0,-1,0,0,0,+1,0,+2),
            new State(-1,0,0,0,+1,0,+2,0)

        ],1);
    }
}
class J extends Shape{
    constructor(){
        super(0,3,0,4,0,5,1,5,"img/J.png",[
            new State(0,-1,0,0,0,+1,+1,+1),
            new State(-1,0,0,0,+1,0,+1,-1),
            new State(0,+1,0,0,0,-1,-1,-1),
            new State(+1,0,0,0,-1,0,-1,+1)
        ],1);
    }
}
class L extends Shape{
    constructor(){
        super(0,3,0,4,0,5,1,3,"img/L.png",[
            new State(0,-1,0,0,0,+1,+1,-1),
            new State(-1,0,0,0,+1,0,-1,-1),
            new State(0,+1,0,0,0,-1,-1,+1),
            new State(+1,0,0,0,-1,0,+1,+1)
        ],1);
    }
}
class S extends Shape{
    constructor(){
        super(0,4,0,5,1,3,1,4,"img/S.png",[
            new State(-1,0,-1,+1,0,-1,0,0),
            new State(0,+1,+1,+1,-1,0,0,0)

        ],3);
    }
}
class Z extends Shape{
    constructor(){
        super(0,3,0,4,1,4,1,5,"img/Z.png",[
            new State(-1,-1,-1,0,0,0,0,+1),
            new State(-1,+1,0,+1,0,0,+1,0)
        ],2);
    }
}