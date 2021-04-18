//jshint esversion:6

//Imports!
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
//Node Traceroute
const traceroute = require('nodejs-traceroute');

const app = express();

//socket import
const httpServer = require("http").createServer(app);
const options = {
  /* ... */ };
const io = require("socket.io")(httpServer, options);

//Static resources HTML and JS (Although all JS is inline in HTML anyway)
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

httpServer.listen(process.env.PORT || 3000);

//Stablishes the socket connection
io.on("connection", socket => {
  console.log("Connection established");

  const randomId = Math.floor(Math.random() * chineseIP.length)
  var item = chineseIP[randomId];
  var chIpLoc = chineseIpLocations[randomId];
  var locName = ipLocationName[randomId];

  socket.emit("videoID", randomId);

  //Listens for Game Over socket event
  socket.on("gameOver", function(data){
    console.log(data);
  //Traceroute Code
  let IPinfo = require("node-ipinfo");

  try {
    const tracer = new traceroute();
    tracer
      .on('pid', (pid) => {
        console.log(`pid: ${pid}`);
      })
      .on('destination', (destination) => {
        console.log(`destination: ${destination}`);
        socket.emit("firewallData", {
          destLocation : chIpLoc,
          destName : locName,
        });
      })
      .on('hop', (hop) => {
        if (hop.ip == 'Request timed out.') {
          console.log('No IP found for this hop');
        } else {
          console.log(hop.ip);
          // Ip lookup code
          let token = tokens[Math.floor(Math.random() * tokens.length)];
          let ip = hop.ip
          let ipinfo = new IPinfo(token);

          ipinfo.lookupIp(ip).then((response) => {
            console.log(response.loc);
            socket.emit("serversLocation", response.loc);
          });
        }
      })
      .on('close', (code) => {
        console.log(`close: code ${code}`);
      });

    tracer.trace(item); //'Aca se recibe a variable que toma una IP random de la lista'
  } catch (ex) {
    console.log(ex);
  }

  tokens = ['bb7e2352dbe47f', "ce97437d272c61", "2a6342e2b06233"]
  //Gets the location of the server where the website is hosted
  async function getHostServerLocation(){
    const response = await fetch("https://api.ipify.org/?format=json");
    const hostIPJson = await response.json();
    const hostIP = await hostIPJson.ip;
    console.log("Host Server IP number is: " + hostIP);

    const request = await fetch("https://ipinfo.io/"+ hostIP + "?token=ce97437d272c61");
    const jsonResponse = await request.json();
    const hostLoc = await jsonResponse.loc;
    console.log("host Server IP location is: " + hostLoc);
    socket.emit("hostServerLocation", hostLoc);
    return (hostLoc)
  }

  getHostServerLocation();

});
});



//GREAT FIREWALL IP, LOCATION AND LOCATION NAME
const chineseIP = ["123.116.144.138","210.76.202.110","210.76.200.126","210.77.17.121","210.72.31.156","210.72.17.11","112.66.16.127","113.108.133.236","58.249.64.155","113.119.160.146","210.77.88.52","27.47.128.243","113.109.118.73","112.66.52.114","112.66.64.131","112.66.66.90","210.75.225.126","112.66.0.204","112.66.6.18","202.127.16.22","210.73.48.41","202.127.21.84","210.72.70.17","202.127.26.190","113.118.97.146","113.118.244.43","113.118.6.104","116.6.100.141","210.75.252.232","61.55.208.120","101.24.217.28","110.241.63.215","121.193.218.76","120.1.56.107","61.55.208.120"];

const chineseIpLocations = [["39.952745, 116.407339"],["39.982954, 116.335473"],["39.907830, 116.251627"],["39.932674, 116.178150"],["39.904574, 116.397694"],["39.912074, 116.331166"],["19.519296, 109.576123"],["23.081898, 113.327275"],["23.121469, 113.454414"],["23.143037, 113.253282"],["23.09323, 113.303894"],["23.126806, 113.369782"],["23.171279, 113.263950"],["20.016304, 110.324285"],["20.021014, 110.331878"],["20.021014, 110.331878"],["39.904574, 116.397694"],["18.293854, 109.511195"],["18.258759, 109.515882"],["31.1627987, 121.439857"],["31.230458, 121.473516"],["31.193391, 121.455112"],["31.381208, 121.231578"],["31.134419, 121.718257"],["22.657670, 114.022996"],["22.621806, 114.038960"],["22.575933, 114.149886"],["22.546025, 114.049054"],["22.553227, 113.944169"],["38.006625, 114.498360"],["38.043060, 114.515552"],["38.034955, 114.465891"],["37.999606, 114.448765"],["38.049721, 114.453403"],["37.997326, 114.489417"]];

const ipLocationName = ["Beijing, AnDingMen", "Beijing, Academy of Sciences LinCui Road","Beijing, Academy of Sciences YuQuan Road","Beijing, PingGuo Yuan", "Beijing, TianAnMen", "Beijing, Water Resources and Hydropower Research", "Danzhou Nada", "Guangzhou Datang", "Guangzhou, Honda (HuangPu)","Guangzhou, Military Hospital", "Guangzhou, SCIO", "Guangzhou, Tianhe Park", "Guangzhou, WuXianJi","Haikou, ABC Highway", "Haikou, Airforce", "Haikou, WuJin", "Haikou, WuJing", "SanYa, DaLong", "Sanya, MeiLiZhiYuan","Shanghai, CaoHeJing","Shanghai, General Office", "Shanghai, Insect Museum","Shanghai, JiaDing School", "Shanghai, PuDong", "Shenzhen, LongHua", "Shenzhen, LongHua China Telecom","Shenzhen, Reservoir", "Shenzhen, ShuiBao", "Shenzhen, Technology Park", "Shijiazhuang, BaoJianFu Building","Shijiazhuang, General Office","Shijiazhuang, Jiwei", "Shijiazhuang, School", "Shijiazhuang, SiJian","Shijiazhuang, Tatan"];


