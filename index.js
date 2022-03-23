//  source : https://www.youtube.com/watch?v=ZjBLbXUuyWg&ab_channel=AbdisalanCodes

const express = require('express');
const fs = require('fs');
const {pipeline} = require('stream');
const app = express();


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

app.get('/video', function(req, res){
    const range = req.headers.range;
    if (!range){
        res.status(400).send('Send range header');
    }
    const videoPath = 'bigbuck.mp4';
    const VideoSize = fs.statSync('bigbuck.mp4').size;
    
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, VideoSize - 1);
    
    const contentLength = end - start + 1
    const headers = {
        'Content-Range' : `bytes ${start}-${end}/${VideoSize}`,
        'Accept-Ranges' : 'bytes',
        'Content-Length' : contentLength,
        'Content-Type' : 'video/mp4',
    }
    res.writeHead(206, headers);
    
    const videoStream = fs.createReadStream(videoPath, {start, end});
    
    // source : https://www.youtube.com/watch?v=aTEDCotcn20&ab_channel=CodingTech
    // time : 6:20 - 
    // videoStream.pipe(res);

    pipeline(videoStream, res, (err) => {
        if (err) {
          console.log(err); // No such file
          // this message can't be sent once `pipeline` already destroyed the socket
          return res.end('error!!!');
        }
    });


})


app.listen(8000, function() {
    console.log('Server on');
});