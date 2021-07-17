/**
 * Created by suge on 2017/6/19.
 */
/**多个监听事件**/
var events = require("events");
var emitter = new events.EventEmitter();
emitter.on("some_event",function(arg1,arg2){
    console.log("这是事件一",arg1,arg2);
});
emitter.on("some_event",function(arg1,arg2){
   console.log("这是事件二",arg1,arg2);
});
emitter.emit("some_event","参数1","参数2");