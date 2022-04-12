import express from 'express';
import path from 'path';
import cors from 'cors';
import monsterRouter from './Endpoints/monsters.mjs';

const __dirname = path.resolve();
const LISTEN_PORT = 3001;


function main() {
    const app = express();
    app.use(cors());


    // app.get('/*',(req,res)=>{
    //     res.sendFile(path.join(__dirname,'../','index.html'));
    // })
    app.use("/monsters",monsterRouter);

    app.get("/test/",async (req,res)=>{
        res.send("Test Complete!")
    });

    app.use(express.static(path.join(__dirname,"public")));
    console.log("Static Folder Resolved to: ",path.join(__dirname,"public"));
    app.listen(LISTEN_PORT);

    console.log("Server successfully started at "+LISTEN_PORT);
    console.log("Use CTL+C to exit...")
}

main();

