/**
 * Created by environmentset on 17. 10. 7.
 */

var commands = ( (Memory,Register,char_table) => {
    var type = require('./typeCheck.js');
    //에러 처리 생성자 함수 로딩
    let Exception = require('./Exception.js');
    var emu_call_table = {
        "1":function print_cmd (string,length) {
            if(!type.is_StringL(string)) throw new RuntimeException("register bx is not a string",{});
            string = util_removeBot(string);
            if(string.length > length) throw new RuntimeException("[string] is longer than [length]",{});
            console.log(string);
        }
    };

    class RuntimeException extends Exception {
        constructor (msg) {
            super(msg);
        }

        toString () {
            return `RuntimeException : ${this.constructor.constructor.toString.call(this)}`;
        }
    }


    function exit () {
        Register.flags.ED = true;
    }

    function emucall () {
        emu_call_table[Register.ax](Register.dx,Register.cx,Register.si,Register.di,Register.bx);
    }

    function ret () {}

    function push (op1) {
        if(typeof op1 === "number") {
            Memory.set_word(op1,Register.sp -= 2);
        } else if (type.is_Register(op1)) {
            Memory.set_word(Register[op1],Register.sp-=2);
        } else if (type.is_StringL(op1)) {
            let stra = util_removeBot(op1).split("").reverse().join("").intCarr();
            let item;
            Memory.set_byte(254,Register.sp--);
            while(item = stra.pop()) {
                Memory.set_byte(item,Register.sp--);
            }
        } else throw new RuntimeException("unknown operator 1");
    }

    function pop (op1) {
        if(Register.sp === Memory.segment.stack.start-1) throw new RuntimeException("Register sp is pointing top of stack");
        if(type.is_Register(op1)) {
            Register[op1] = Memory.get_word(Register.sp);
            Register.sp+=2;
        } else if(type.is_mem(op1)) {
            let address = util_getMemoryAdress(op1);
            Memory.set_word(Memory.get_word(Register.sp),address);
            Register.sp+=2;
        } else if(char_table.has(op1)) {
            Memory.set_word(Memory.get_word(Register.sp),char_table.get(op1));
            Register.sp+=2;
        } else throw new RuntimeException("operator 1 is not a Memory or Register");
    }

    function jmp (op1) {
        if(type.is_mem(op1)) {
            Register.ip = util_getMemoryAdress(op1);
        } else if(char_table.has(op1)) {
            Register.ip = char_table.get(op1);
        } else throw new RuntimeException("no memory address")
    }

    function je () {}

    function jne () {}

    function mov (op1,op2) {
        if(type.is_Register(op1)) {
            if(typeof op2 === "number") {
                Register[op1] = op2;
            } else if(type.is_mem(op2)) {
                Register[op1] = Memory.get_byte(op2);
            } else if(type.is_Register(op2)) {
                Register[op1] = Register[op2];
            } else if(char_table.has(op2)) {
                Register[op1] = Memory.get_byte(char_table.get(op2));
            } else if(type.is_StringL(op2)) {
                Register[op1] = op2;
            } else throw new RuntimeException("operator 2 is not a value");
        } else if(type.is_mem(op1)) {
            op1 = util_getMemoryAdress(op1);
            if(typeof op2 === "number") {
                Memory.set_word(op2,op1);
            } else if(type.is_mem(op2)) {
                throw new RuntimeException("Memory to Memory is Not Allowed");
            } else if(type.is_Register(op2)) {
                Memory.set_word(Register[op2],op1);
            } else if(char_table.has(op2)) {
                throw new RuntimeException("Memory to Memory is Not Allowed");
            } else if(type.is_StringL(op2)) {
                let stra = util_removeBot(op2).split("").reverse().join("").intCarr();
                let item;
                Memory.set_byte(254,op1);
                while(item = stra.pop()) {
                    Memory.set_byte(item,op1++);
                }
            } else throw new RuntimeException("operator 2 is not a value");
        } else if(char_table.has(op1)) {
            op1 = char_table.get(op1);
            if(typeof op2 === "number") {
                Memory.set_word(op2,op1);
            } else if(type.is_mem(op2)) {
                throw new RuntimeException("Memory to Memory is Not Allowed");
            } else if(type.is_Register(op2)) {
                Memory.set_word(Register[op2],op1);
            } else if(char_table.has(op2)) {
                throw new RuntimeException("Memory to Memory is Not Allowed");
            } else if(type.is_StringL(op2)) {
                let stra = util_removeBot(op2).split("").reverse().join("").intCarr();
                let item;
                Memory.set_byte(254,op1);
                while(item = stra.pop()) {
                    Memory.set_byte(item,op1++);
                }
            } else throw new RuntimeException("operator 2 is not a value");
        } else throw new RuntimeException("operator 1 is not a Memory or Register");
    }

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