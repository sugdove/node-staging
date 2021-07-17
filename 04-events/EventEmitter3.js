/**
 * Created by suge on 2017/6/20.
 */
var events = require("events");
var emitter =new events.EventEmitter();
var listener1 = function listener1(){
    console.log("这是监听器1")
};
var listener2 = function listener2(){
    console.log("这是监听器2")
};
emitter.addListener("some_event",listener1);
emitter.on("some_event",listener2);
var num = require("events").EventEmitter.listenerCount(emitter,"some_event");
console.log("监听器的数量为："+num);
emitter.emit("some_event");
emitter.removeListener("some_event",listener1);
console.log("监听器1已被移除");
var num2 = require("events").EventEmitter.listenerCount(emitter,"some_event");
console.log("监听器的数量为："+num2);
emitter.emit("some_event");
