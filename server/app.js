const { restart } = require("nodemon");

const Express = require("express")();

const Http = require("http").Server(Express);

const Socketio = require("socket.io")(Http ,{
    cors: {
        origin: '*',
    }
});

// عدد اللاعبين
var num = 0;

// دور مين هلق
var cur = 0;

// السوكيت لكل لاعب
var sockets = [];

// المواقع المضروبة عند كل اللاعبين بتاخد 3 قيم 0 إذا لسى ما انضربت 1 إذا انضرب و ما فيّا شي 2 إذا انضربت و فيّا شي
var hittedPosition = [];

// مواقع السفن الأصلية بكل اللاعبين
var ShipsPositions = [];

// حالة اللعبة حالياً
var gameReady = false;

var playersReady = [0 , 0 , 0 , 0]; // 0 --> not ready , 1 --> ready , 2 --> loser

var playerScore = [0 , 0 , 0 , 0];

var playerNames = ["" , "" , "" , ""];

var playingPlayers = 0;
var numberOfReady = 0;
// تهيأة المصفوفة تبع المواقع المضروبة
for(var l=0;l<4;++l){
    hittedPosition.push( new Array(9).fill(0).map(() => new Array(9).fill(0)) );
    ShipsPositions.push( new Array(9).fill(false).map(() => new Array(9).fill(false)) );
}
var monetoringSockets = [];

function refresh(){
    num = 0;
    cur = 0;
    sockets = [];
    hittedPosition = [];
    ShipsPositions = [];
    gameReady = false;
    playersReady = [0 , 0 , 0 , 0]; // 0 --> not ready , 1 --> ready , 2 --> loser
    playerScore = [0 , 0 , 0 , 0];
    playerNames = ["" , "" , "" , ""];
    playingPlayers = 0;
    numberOfReady = 0;
    for(var l=0;l<4;++l){
        hittedPosition.push( new Array(9).fill(0).map(() => new Array(9).fill(0)) );
        ShipsPositions.push( new Array(9).fill(false).map(() => new Array(9).fill(false)) );
    }
    monetoringSockets = [];
}

// مع كل شخص بيتصل رح يستدعى هالتابع
Socketio.on("connection" , socket => {

    if(gameReady || num==4){
        // هندل باقي حالة الرؤيا
        socket.emit("monitoring" , true);
        socket.emit("start" , num);
        socket.emit("monetoringPositions" , ShipsPositions);
        socket.emit("names" , playerNames);
        socket.emit("start3" , hittedPosition);
    } else {
        // socket is the person who was added
        socket.emit("start2" , num);
        Socketio.emit("start" , ++num);
        socket.emit("start3" , hittedPosition);
        sockets.push(socket);
        
        // socket.emit("position" , position);
        // رح نبعت لهل الشخص اللي اسمو سوكيت هالمعلومة مبدأياً المواقع
        socket.on('disconnect', function () {
            // هندل موضوع إذا حدا فصل يرفرش السيرفر متل ما هو
            socket.emit('disconnected');
            Socketio.emit("start" , --num);
            var i = sockets.indexOf(socket);
            sockets.splice(i , 1);
        });

        socket.on('refresh' , data=>{
            for(soc of sockets){
                soc.emit("close");
                soc.disconnect();
            }
            for(soc of monetoringSockets){
                soc.emit("close");
                soc.disconnect();
            }
            refresh();
        });

        // وقت بيعملو ريدي العالم بتنرسل المواقع تبع السفن للسرفر و حالياً السرفر عندو مواقع السفن لكل اللاعبين
        socket.on('ready' , data=>{
            var i = sockets.indexOf(socket);
            playersReady[i] = 1; numberOfReady++;
            if(num == numberOfReady) {
                Socketio.emit("names" , playerNames);
                gameReady = true;
                playingPlayers = num;
            }
        });
        socket.on('name' , data=>{
            var i = sockets.indexOf(socket);
            playerNames[i] = data;
        });
        socket.on('ShipsPositions' , data=>{
            var index = sockets.indexOf(socket);
            ShipsPositions[index] = data;
            for (let i = 0; i < 9; i++) 
                for (let j = 0; j < 9; j++) 
                    if(ShipsPositions[index][i][j])
                        playerScore[i]++;
        });

        socket.on("move" , data=>{
            var i = 0;
            for(var soc of sockets){
                if(soc == socket) {
                    if(i != cur)
                        return ;
                    break;
                }
                i++;
            }

            cur++; cur %= num;
            while(playersReady[cur] == 2){
                cur++; cur %= num;
            }
            
            i = 0;
            for(var soc of sockets){
                if(soc === socket){
                    i++;
                    continue;
                }
                if(ShipsPositions[i][data.x-1][data.y-1]){
                    hittedPosition[i][data.x-1][data.y-1] = 2;
                    playerScore[i]--;
                } else {
                    hittedPosition[i][data.x-1][data.y-1] = 1;
                }
                if(playerScore[i] == 0){
                    playersReady[i] = 2;
                    playingPlayers--;
                }
                if(playingPlayers == 1) {
                    // end the game
                    for(let idx =0;idx<num;++idx){
                        if(playersReady[idx] == 1){
                            Socketio.emit("winner" , idx);
                            break;
                        }
                    }
                }
                i++;
            }

            Socketio.emit("hittedPosition" , hittedPosition);
        });
    }
});

Http.listen(3000 , ()=>{
    console.log("Lestning at :3000..");
});

