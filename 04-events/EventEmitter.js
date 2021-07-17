/**
 * Created by suge on 2017/6/19.
 */
var events = require("events");
var emitter =new events.EventEmitter();
emitter.on("some_event",function(){
   console.log("some_event时间延时一秒触发");
});
setTimeout(function(){emitter.emit("some_event")},1000);
function he(){
   console.log("xxxx");
   setTimeout(he,1000);
}
he();
var test = function test(){
  console.log("1111")
};
