/**
 * Created by environmentset on 17. 10. 7.
 */

var commands = ( (Memory,Register,label_table,var_table,Exception) => {
    var type = require('./typeCheck.js');
    var emu_call_table = {
        "0":function print_cmd (string,length) {
            if(!type.is_StringL(string)) throw new Exception("register bx is not a string",{});
            string = util_removeBot(string);
            if(string.length > length) throw new Exception("[string] is longer than [length]",{});
            console.log(string);
        },
        "1":function input_cmd (ptr,length) {
            //Not yet
            throw "Not yet";
            if(type.is_mem(ptr)) {
                if(typeof length === "number") {
                    Memory.set(rl.prompt(),)
                } else  throw new Exception("length is not a number", {});
            } else if (type.is_Register(ptr)) {
                if(typeof length === "number") {

                } else  throw new Exception("length is not a number", {});
            } else if (var_table.has(ptr)) {
                if(typeof length === "number") {

                } else  throw new Exception("length is not a number", {});
            } else throw new Exception("ptr is not a Register or Memory.", {});
        },
    };

    function exit () {
        Register.flags.ED = true;
    }

    function emucall () {
        var op1 = Register.ax,op2 = Register.bx,op3 = Register.cx, op4 = Register.dx;
        emu_call_table[op1](op2,op3,op4);
    }

    function ret () {
        Register.ip = Memory.get(Register.sp);
        Register.sp += 1;
    }

    function push (op1) {
        Register.sp -= 1;
        if(type.is_Register(op1)) {
            Memory.set(Register[op1],Register.sp);
        } else if (type.is_digit(op1)) {
            Memory.set(Number(op1),Register.sp);
        } else {
            Memory.set(op1,Register.sp);
        }
    }

    function pop (op1) {
        if(type.is_Register(op1)) {
            Register[op1] = Memory.get(Register.sp);
        } else throw new Exception("operand 1 is not a Register",{});
        Register.sp += 1;
    }

    function jmp (op1) {
        if(label_table.has(op1)) {
            var ptr = label_table.get(op1);
            Register.ip = ptr+1;
        } else if (type.is_mem(op1)) {
            Register.ip = util_getMemoryAdress(op1);
        } else throw new Exception("unknown adress",{});
    }

    function je () {}

    function jne () {}

    function mov (op1,op2) {
        if (type.is_mem(op1)) {
            if(type.is_Register(op2)) {
                Memory.set(Register[op2],util_getMemoryAdress(op1));
            } else if (type.is_digitL(op2)) {
                Memory.set(Number(op2),util_getMemoryAdress(op1));
            } else if (type.is_mem(op2)){
                throw new Exception("can't move data Memory to Memory",{});
            } else if (type.is_StringL(op2)) {
                Memory.set(op2,util_getMemoryAdress(op1));
            } else if (var_table.has(op2)) {
                Memory.set(Memory.get(var_table.get(op2)),util_getMemoryAdress(op1));
            } else  throw new Exception("unknown operand",{});
        } else if (var_table.has(op1)) {
            if(type.is_mem(op2)) {
                throw new Exception("can't move data Memory to Memory",{});
            } else if (type.is_digitL(op2)) {
                Memory.set(Number(op2),var_table.get(op1));
            } else if (type.is_Register(op2)){
                Memory.set(Register[op2],var_table.get(op1));
            } else if (type.is_StringL(op2)) {
                Memory.set(op2,var_table.get(op1));
            } else if (var_table.has(op2)) {
                throw new Exception("can't move data Memory to Memory",{});
            } else  throw new Exception("unknown operand",{});
        } else if(type.is_Register(op1)) {
            if(type.is_mem(op2)) {
                Register[op1] = Memory.get(util_getMemoryAdress(op2));
            } else if (type.is_Register(op2)) {
                Register[op1] = Register[op2];
            } else if (type.is_digitL(op2)) {
                Register[op1] = Number(op2);
            } else if (type.is_StringL(op2)) {
                Register[op1] = op2;
            } else if (var_table.has(op2)) {
                Register[op1] = Memory.get(var_table.get(op2));
            } else  throw new Exception("unknown operand",{});
        } else throw new Exception("op1 is not a Register and Memory ptr",{});
    }

    function lea (op1,op2) {
        var adr;
        if(var_table.has(op2)) {
            adr = var_table.get(op2);
            if(type.is_mem(op1)) {
                Memory.set(adr,util_getMemoryAdress(op1));
            } else if (type.is_Register(op1)) {
                Register[op1] = adr;
            } else if (var_table.has(op1)) {
                Memory.set(adr,var_table.get(op1));
            } else throw new Exception("unknown operand",{});
        } else if (label_table.has(op2)) {
            adr = label_table.get(op2);
            if(type.is_mem(op1)) {
                Memory.set(adr,util_getMemoryAdress(op1));
            } else if (type.is_Register(op1)) {
                Register[op1] = adr;
            } else if (var_table.has(op1)) {
                Memory.set(adr,label_table.get(op1));
            } else throw new Exception("unknown operand",{});
        } else throw new Exception("op2 is not a label or variable",{});
    }

    function add (op1,op2) {
        if (type.is_mem(op1)) {
            var op1v = Memory.get(util_getMemoryAdress(op1));
            if(type.is_Register(op2)) {
                Memory.set(Register[op2]+op1v,util_getMemoryAdress(op1));
            } else if (type.is_digitL(op2)) {
                Memory.set(Number(op2)+op1v,util_getMemoryAdress(op1));
            } else if (type.is_mem(op2)){
                throw new Exception("can't move data Memory to Memory",{});
            } else if (type.is_StringL(op2)) {
                Memory.set(op2+op1v,util_getMemoryAdress(op1));
            } else if (var_table.has(op2)) {
                Memory.set(Memory.get(var_table.get(op2))+op1v,util_getMemoryAdress(op1));
            } else  throw new Exception("unknown operand",{});
        } else if (var_table.has(op1)) {
            var op1v =  Memory.get(var_table.get(op1));
            if(type.is_mem(op2)) {
                throw new Exception("can't move data Memory to Memory",{});
            } else if (type.is_digitL(op2)) {
                Memory.set(Number(op2)+op1v,var_table.get(op1));
            } else if (type.is_Register(op2)){
                Memory.set(Register[op2]+op1v,var_table.get(op1));
            } else if (type.is_StringL(op2)) {
                Memory.set(op2+op1v,var_table.get(op1));
            } else if (var_table.has(op2)) {
                throw new Exception("can't move data Memory to Memory",{});
            } else  throw new Exception("unknown operand",{});
        } else if(type.is_Register(op1)) {
            if(type.is_mem(op2)) {
                Register[op1] = Memory.get(util_getMemoryAdress(op2));
            } else if (type.is_Register(op2)) {
                Register[op1] += Register[op2];
            } else if (type.is_digitL(op2)) {
                Register[op1] += Number(op2);
            } else if (type.is_StringL(op2)) {
                Register[op1] += op2;
            } else if (var_table.has(op2)) {
                Register[op1] += Memory.get(var_table.get(op2));
            } else  throw new Exception("unknown operand",{});
        } else throw new Exception("op1 is not a Register and Memory ptr",{});
    }

    function sub (op1,op2) {}

    function cmp () {}

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
        "cmp":cmp
    };
});

module.exports = commands;