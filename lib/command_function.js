/**
 * Created by environmentset on 17. 10. 7.
 */

var commands = ( (Memory,Register,char_table) => {
    let type = require('./typeCheck.js');
    //에러 처리 생성자 함수 로딩
    let Exception = require('./Exception.js');
    var emu_call_table = {
        "1":function print_cmd (string,length) {
            if(!type.is_StringL(string)) throw new RuntimeException("register dx is not a string",{});
            string = util_removeBot(string);
            if(string.length > length) throw new RuntimeException("[string] is longer than [length]",{});
            console.log(string);
        },
        "2":function input_cmd (saveAble,size) {

        },
        "3":function print_strarr_cmd (string,length) {
            let str_arr = [];
            let item;
            while(item = Memory.get_byte(string++)) {
                str_arr.push(item);
            }
            if(string.length > length) throw new RuntimeException("[string] is longer than [length]",{});
            console.log(String.fromCharCode(...(str_arr.reverse())));
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

    function ret () {
    }

    function push (op1) {

    }

    function pop (op1) {

    }

    function jmp (op1) {

    }

    function je () {}

    function jne () {}

    function mov (op1,op2) {

    }

    function lea (op1,op2) {

    }

    function add (op1,op2) {}

    function sub (op1,op2) {}

    function cmp (op1,op2) {}

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
        "cmp":cmp
    };
});

module.exports = commands;