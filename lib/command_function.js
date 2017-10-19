/**
 * Created by environmentset on 17. 10. 7.
 */

var commands = ( (Memory,Register,char_table,Exception) => {
    var type = require('./typeCheck.js');
    var emu_call_table = {
        "0":function print_cmd (string,length) {
            if(!type.is_StringL(string)) throw new Exception("register bx is not a string",{});
            string = util_removeBot(string);
            if(string.length > length) throw new Exception("[string] is longer than [length]",{});
            console.log(string);
        }
    };

    function exit () {
        Register.flags.ED = true;
    }

    function emucall () {}

    function ret () {}

    function push (op1) {}

    function pop (op1) {}

    function jmp (op1) {}

    function je () {}

    function jne () {}

    function mov (op1,op2) {}

    function lea (op1,op2) {}

    function add (op1,op2) {}

    function sub (op1,op2) {}

    function cmp (op1,op2) {}

    function label () {}

    function util_getMemoryAdress (string) {
        var adress = string.substr(1,string.length-2); // why? -2??
        while(type.is_Register(adress)) {
            adress = adress.replace("ax",String(Register.ax));
            adress = adress.replace("bx",String(Register.bx));
            adress = adress.replace("cx",String(Register.cx));
            adress = adress.replace("si",String(Register.si));
            adress = adress.replace("di",String(Register.di));
            adress = adress.replace("dx",String(Register.dx));
            adress = adress.replace("bp",String(Register.bp));
            adress = adress.replace("sp",String(Register.sp));
            adress = adress.replace("ip",String(Register.ip));
        }
        adress = eval(adress); // soon change to util_stringMath
        return adress;
    }

    function util_removeBot (string) {
        var regex = /"/;
        while(regex.test(string)) {
            string = string.replace(regex,"");
        }
        return string;
    }

    function util_stringMath (string) {

    }

    return {
        "exit":exit,
        "emucall":emucall,
        "ret":ret,
        "push":push,
        "pop":pop,
        "jmp":jmp,
        "je":je,
        "jne":jne,
        "mov":mov,
        "lea":lea,
        "add":add,
        "sub":sub,
        "cmp":cmp,
        "label":label
    };
});

module.exports = commands;