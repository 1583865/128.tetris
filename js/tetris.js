"use strict";
var game={
    CN:10,RN:20,
    CSIZE:26,               //每个格子的大小
    OFFSET:15,              //黑框距容器边界的padding
    shape:null,             //保存正在下落的主角图形
    nextShape:null,         //保存备胎
    timer:null,             //设置定时器
    interval:400,           //每次下落的时间间隔
    wall:null,              //设置墙 保存方块
    score:0,                //保存得分
    SCORES:[0,10,30,60,100],//保存行数对应得分的数组
    lines:0,                //保存消除的行
    level:1,                //保存游戏等级
    status:1,               //保存状态序号
    GAMEOVER:0,             //游戏结束
    RUNNING:1,              //继续
    PAUSE:2,                //暂停

    pg:document.querySelector(".playground"),
    // 强调: 1. 每个属性/方法之间必须加逗号！
    //       2. 只要自己的方法要访问自己的属性，必须加this.
	/******************** 启动游戏 游戏状态 **********************/
    //启动游戏
    start(){
        this.status=this.RUNNING;
        //行数和得分归零
        this.lines=this.score=0;
        //游戏等级
        this.level=1;
        //this->game
        //初始化墙RN*CN
        this.wall=[];
        for(var r=0;r<this.RN;r++){
            this.wall[r]=new Array(this.CN)
        }
        //随机生成主角和备胎图形
        this.shape=this.randomShape();
        this.nextShape=this.randomShape();
        //重绘一切
        this.paint();
        //启动定时器 周期下落
        this.timer=setInterval(this.moveDown.bind(this),this.interval);

        //为网页绑定键盘按下事件
        document.onkeydown=function(e){
            //alert(e.keyCode);
            switch(e.keyCode){
                case 37://左
                    if(this.status==this.RUNNING)
                        this.moveLeft();
                    break;
                case 39://右
                    if(this.status==this.RUNNING)
                        this.moveRight();
                    break;
                case 40://下
                    if(this.status==this.RUNNING)
                        this.moveDown();
                    break;
                case 32://空格
                    if(this.status==this.RUNNING)
                        this.hardDrop();
                    break;
                case 38://上->顺时针旋转
                    if(this.status==this.RUNNING)
                        this.rotateR();
                    break;
                case 90://Z->逆时针旋转
                    if(this.status==this.RUNNING)
                        this.rotateL();
                    break;
                case 83://S->重启游戏
                    if(this.status==this.GAMEOVER)
                        this.start();
                    break;
                case 80://P->暂停
                    if(this.status==this.RUNNING)
                        this.pause();
                    break;
                case 67://C->暂停状态继续
                    if(this.status==this.PAUSE)
                        this.myContinue();
                    break;
                case 81://Q->放弃
                    if(this.status!=this.GAMEOVER)
                        this.gameover();
            }
        }.bind(this);
        //默认this是document
    },
    //暂停
    pause(){
        clearInterval(this.timer);
        this.timer=null;
        this.status=this.PAUSE;
        this.paint();
    },
    //游戏结束
    gameover(){
        //停止定时器:
        clearInterval(this.timer);
        this.timer=null;
        this.status=this.GAMEOVER;
        this.paint();
    },
    //继续游戏
    myContinue(){
        //启动周期性定时器
        this.timer=setInterval(
            this.moveDown.bind(this)
            ,
            this.interval
        );
        this.status=this.RUNNING;
        this.paint();
    },
    //随机生成图像
    randomShape(){
        switch(Math.floor(Math.random()*7)){
            case 0: return new O();
            case 1: return new T();
            case 2: return new I();
            case 3: return new J();
            case 4: return new L();
            case 5: return new S();
            case 6: return new Z();
        }
    },
    //判断游戏是否结束
    isGAMEOVER(){
        //遍历备胎图形中每个cell
        for(var cell of this.nextShape.cells){
            //如果在wall中cell相同位置有格
            if(this.wall[cell.r][cell.c]!==undefined){
                return true;//返回true
            }
        }//(遍历结束)
        return false;//返回false
    },
    //绘制得分
    paintScore(){
        //查找pg下所有span
        var spans=document.getElementsByTagName("span");
        spans[0].innerHTML=this.score;//设置第一个span的内容为score
        spans[1].innerHTML=this.lines;//设置第二个span的内容为lines
        spans[2].innerHTML=this.level;//设置第三个span的内容为level
    },
    //绘制状态
    paintStatus(){
        if(this.status==this.GAMEOVER){
            var img=new Image();
            img.src="img/game-over.png";
            this.pg.appendChild(img);
        }else if(this.status==this.PAUSE){
            var img=new Image();
            img.src="img/pause.png";
            this.pg.appendChild(img);
        }
    },
//************************上下左右旋转*************************
    //一落到底
    hardDrop(){
        while(this.canDown()){
            this.moveDown();
        }
    },
    //判断能否旋转
    canRotate(){
        //遍历主角图形的cells中每个cell
        for(var i=0;i<this.shape.cells.length;i++){
            var cell=this.shape.cells[i];//临时保存cell
            //如果cell的r<0或r>=RN或c<0或c>=CN或在wall中相同位置有格
            if(
                cell.r<0||
                cell.r>=this.RN||
                cell.c<0||
                cell.c>=this.CN||
                this.wall[cell.r][cell.c]
            )return false;//就返回false
        }
        return true;//就返回true
    },
    //顺时针旋转
    rotateR(){
        //让主角顺时针旋转一次
        this.shape.rotateR();
        //如果不能旋转
        if(!this.canRotate()){
            //再逆时针转回来
            this.shape.rotateL();
        }else{
            //重绘一切
            this.paint();
        }
    },
    //逆时针旋转
    rotateL(){
        this.shape.rotateL();
        if(!this.canRotate()){
            this.shape.rotateR();
        }else{
            this.paint();
        }
    },
    //判断能否左移
    canLeft(){
        //遍历主角的cells中每个cell
        for(var cell of this.shape.cells){
            //如果cell的c==0
            //或wall中cell左侧不是undefined
            if(cell.c==0||this.wall[cell.r][cell.c-1]!==undefined){
                return false;//就返回false
            }
        }
        //(遍历结束)
        //才返回true
        return true;
    },
    //左移一列
    moveLeft(){
        //如果可以左移
        if(this.canLeft())
        //让主角shape左移一列
        this.shape.moveLeft();
        //重绘一切
        this.paint();
    },
    //判断能否右移
    canRight(){
        //遍历主角的cells中每个cell
        for(var cell of this.shape.cells) {
            //如果cell的c==CN-1
            //或wall中cell右侧不是undefined
            if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]!==undefined){
                return false;//就返回false
            }
        }
        //(遍历结束)
        //才返回true
        return true;
    },
    //右移一列
    moveRight(){
        //如果可以右移
        if(this.canRight())
        //让主角右移一列
        this.shape.moveRight();
        //重绘一切
        this.paint();
    },
    //判断能否下移
    canDown(){
        for(var cell of this.shape.cells){
            if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]!==undefined){
                return false
            }
        }
        return true
    },
    //下落一行 如果不能下落 生成 新主角
    moveDown(){
        //如果可以下落
        if(this.canDown()){
            //让主角图形下落一行
            this.shape.moveDown();
        }else{
            //将主角中所有格存入wall中相同位置
            this.landIntoWall();
            //判断并删除满格行
            var ln=this.deleteRows();
            this.lines+=ln;
            this.score+=this.SCORES[ln];
            //如果游戏没有结束
            if(!this.isGAMEOVER()){
                //备胎转正，再生成新备胎
                this.shape=this.nextShape;
                this.nextShape=
                    this.randomShape();
            }else{//否则
                //停止定时器:
                clearInterval(this.timer);
                this.timer=null;
                this.status=this.GAMEOVER;
            }
        }
        //重绘一切
        this.paint();
    },
//************************ 删除满格行 *************************
    //删除所有满格行
    deleteRows(){
        var ln=0;//记录本次删除的行数
        //自底向上反向遍历wall中每一行
        for(var r=this.RN-1;r>=0;r--){
            //如果当前行是空行，则不再向上遍历
            if(this.wall[r].join("")===""){
                break;
            }
            //如果r是满格行
            if(this.isFullRow(r)){
                //就删除第r行
                this.deleteRow(r);
                ln++;
                if(ln==4){break;}
                //r要留在原地
                r++;
            }
        }
        return ln;
    },
    //判断r行是否满格
    isFullRow(r){
        var reg=/^,|,,|,$/;
        if(reg.test(String(this.wall[r]))){
            return false;
        }else{
            return true;
        }
    },
    //删除第r行
    deleteRow(r){
        //从r开始，反向向上遍历wall中剩余行
        for(;r>=0;r--){
            //用r-1行赋值给r行
            this.wall[r]=this.wall[r-1];
            //将r-1行置为CN个空元素的数组
            this.wall[r-1]=new Array(this.CN);
            //遍历r行中每个格
            for(var cell of this.wall[r]) {
                //如果格不是undefined
                if(cell!==undefined){
                    //就给当前格的r+1
                    cell.r++;
                }
            }
            //(遍历结束)
            //如果r-2行是空行
            if(this.wall[r-2].join("")===""){
                break;//就退出循环
            }
        }
    },
//************************ 重绘 压入墙 ************************
    //压入墙中
    landIntoWall(){
        //遍历主角中的cells中的每个cell
        for(var cell of this.shape.cells){
            //将cell保存到well中相同的位置
            this.wall[cell.r][cell.c]=cell;
        }
    },
    //重绘一切
    paint(){
        //清除pg中的所有img
        var reg=/<img .*>/ig;
        this.pg.innerHTML=this.pg.innerHTML.replace(reg,"");
        //重绘主角
        this.paintShape();
        //再重绘墙
        this.paintWall();
        //重绘得分
        this.paintScore();
        //重绘备胎
        this.paintNext();
        //重绘状态
        this.paintStatus();
    },
    //重绘备胎
    paintNext(){
        var frag=
            document.createDocumentFragment();
        //遍历备胎图形中cells数组中每个cell
        for(var cell of this.nextShape.cells){
            //每遍历一个cell就向页面添加一个img,并设置img的大小,位置和src
            var img=new Image();
            img.style.cssText=
                `width:${this.CSIZE}px;
         left:${this.CSIZE*(cell.c+10)
                +this.OFFSET}px;
         top:${this.CSIZE*(cell.r+1)
                +this.OFFSET}px`;
            img.src=cell.src;
            //将img追加到frag中
            frag.appendChild(img);
        }
        //将frag整体追加到pg
        this.pg.appendChild(frag);
    },
    //重绘墙
    paintWall(){
        var frag= document.createDocumentFragment();
        //遍历墙中每个格
        for(var r=this.RN-1;r>=0;r--){
            if(this.wall[r].join("")===""){
                break;
            }
            for(var c=0;c<this.CN;c++){
                var cell=this.wall[r][c];
                if(cell!=undefined){
                    //创建img,设置大小位置,src
                    var img=new Image();
                    img.style.width=this.CSIZE+"px";
                    img.style.left=this.CSIZE*cell.c+this.OFFSET+"px";
                    img.style.top=this.CSIZE*cell.r+this.OFFSET+"px";
                    img.src=cell.src;
                    //将img追加到frag中
                    frag.appendChild(img);
                }
            }
        }
        //将frag整体追加到pg
        this.pg.appendChild(frag);
    },
    //绘制主角图形 正在下落的主角
    paintShape(){
        var frag= document.createDocumentFragment();
        //遍历主角图形中cells数组中每个cell
        for(var cell of this.shape.cells){
            //每遍历一个cell就向页面添加一个img,并设置img的大小,位置和src
            var img=new Image();
            img.style.width=this.CSIZE+"px";
            img.style.left=this.CSIZE*cell.c+this.OFFSET+"px";
            img.style.top=this.CSIZE*cell.r+this.OFFSET+"px";
            img.src=cell.src;
            //将img追加到frag中
            frag.appendChild(img);
        }
        //将frag整体追加到pg
        this.pg.appendChild(frag);
    }
};
game.start();
