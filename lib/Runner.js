/**
 * Created by environmentset on 17. 10. 5.
 */
//변수 파싱.
    //메모리 오버플로 방지
var runner = ( () => {
    var fs = require('fs');
    var Exception = require('./Exception.js');
    var StringBuffer = require('./StringBuffer.js');
    var type = require('./typeCheck.js');
    var Memory = require('./Memory.js'); // 16bit
    var Register = require('./Register.js');
    var command_function = require("./command_function.js");
    var Runner = Object.create(null);

    var label_table = new Map(); // label : code ptr
    var var_table = new Map();
    var mnemonic_table = [
       "exit","emucall","ret","push","pop","jmp","call","je","jne","mov","lea","add","sub","cmp"
    ];

    class RunnerException extends Exception {
        constructor (msg,self = {}) {
            super(msg);
            this.self = self;
        }

        toString () {
            return `RunnerException : ${this.constructor.constructor.toString.call(this)} \n ${this.self}`;
        }
    }

    class label {
        constructor (name,ptr) {
            this.name = name;
            this.start = ptr+1;
            this.end = null;
            this.codes = [];
            this.type = "label";
        }

        setEndPoint (ptr) {
            this.end = ptr;
        }

        take () {
            this.codes = [];
            for(var ptrc = 0,offset = this.end - this.start; ptrc < offset ; ptrc++) {
                this.codes.push(Memory.get(this.start+ptrc));
            }
        }

        pushCode (code) {
            this.codes.push(code);
        }
    }

    class command {
        constructor (mne,op1,op2) {
            this.mne = mne;
            this.op1 = op1;
            this.op2 = op2;
            this.type = "command";
        }

        execute () {
            command_function[this.mne](this.op1,this.op2);
        }
    }

    //@param Commands Array [line] Number [index]
    //@return String command
    Runner.fetch = (line,index) => {
        return line[index].trim();
    };
    //@param String line
    //@return Object token
    Runner.decode = function (line) {
        // asm code looks like [label:] [mnemonic [operands]] [; comment]
        var Buffer = new StringBuffer(line);
        var monic = Buffer.get_identifier(),left = null,dash = null,right = null;

        if(!type.is_alphabet(monic)) {
            throw new RunnerException("first word is not mnemonic ",{"line" : line});
        }

        left = Buffer.get_token();

        if (left != null) {
            dash = Buffer.get_token();
            if(dash === ",") {
                right = Buffer.get_token();
                if(right === null) {
                    throw new RunnerException('syntax error; cannot find right operand');
                }
            } else if (dash != null) {
                throw new RunnerException('syntax error; right operand must be after comma(,)');
            }
        }

        //token
        return new command(monic,left,right);
    };
    //@param token Object [info] String [type]
    Runner.append = function (info) {
        if(info.type === "label") {
            label_table.set(info.name,info);
            Memory.set(info,info.start-1);
        } else { // if type === command
            if(mnemonic_table.includes(info.mne)) {
                Memory.set(info,Memory.segment.code.ptr++);
            } else throw new RunnerException("unknown mnemonic",info);
        }
    };

    Runner.execute = function (start) {
        Register.bp = Memory.segment.stack.end;
        Register.sp = Memory.segment.stack.end;
        Register.cs = Memory.segment.code.start;
        Register.bs = Memory.segment.bss.start;
        Register.ds = Memory.segment.data.start;
        Register.ip = start.start;
        while(!Register.flags.ED) {
            var item = Memory.get(Register.ip++);
            if(item.type === "label") throw new RunnerException("program end without exit command",item);
            item.execute();
        }
    };

    //@param String [filename]
    Runner.run = function (filename) {
        var code = fs.readFileSync(__dirname+'/../'+filename,'utf8');
        var lines = code.split('\n');

        var segment = null;
        var label_p = null;

        var enter_point = null;
        for(var i = 0,len = lines.length; i < len;i++) {
            let line = this.fetch(lines,i);
            if (line.charAt(line.length - 1) === '\r') line = line.substr(0, line.length - 1);
            if (line==="" || line.charAt(0) === ';'){
                continue ;
            } else if (line.charAt(0) === '.') {
                segment = line;
            } else if (line.charAt(line.length-1) === ':') {
                if (segment === null) throw new RunnerException("segment is null",{"line_number": i, "line" : line});
                if (segment === ".code") {
                    if(type.is_Register(line.substr(0,line.length-1)))  throw new Exception("label's identifier and Register name is  same",{"line_number": i, "line" : line});
                    if(label_table.has(line.substr(0,line.length-1))) throw new RunnerException("label is already exits",{"line_number": i, "line" : line});
                    if(label_p != null) {
                        label_p.setEndPoint(Memory.segment.code.ptr-1);
                    }
                    label_p = new label(line.substr(0,line.length-1),Memory.segment.code.ptr++);
                    if(label_p.name === "_start") enter_point = label_p;
                    this.append(label_p);
                } else throw new RunnerException("segment is not a code segment",{"line_number": i, "line" : line});
            } else {
                if (segment === null) throw new RunnerException("segment is null",{"line_number": i, "line" : line});
                if (segment === ".code") {
                    var token = this.decode(line);
                    if(label_p != null) {
                        label_p.pushCode(token);
                        this.append(token);
                    } else throw new RunnerException("no label for code.",{"line_number": i, "line" : line});
                } else if (segment === ".bss") {
                    var name = line.trim();
                    if(name.length>0) {
                        if(type.is_Register(name)) throw new Exception("variable's identifier and Register name is  same",{"line_number": i, "line" : line});
                        if(!type.is_alphabetL(name)) throw new RunnerException("only alphabet can be variable's identifier",{"line_number": i, "line" : line});
                        Memory.set(null,Memory.segment.bss.ptr);
                        var_table.set(name,Memory.segment.bss.ptr++);
                    }
                } else if (segment === ".data") {
                    var item = new StringBuffer(line);
                    var name = item.get_identifier();
                    var value = item.get_token();
                    if(type.is_Register(name)) throw new Exception("variable's identifier and Register name is  same",{"line_number": i, "line" : line});
                    if(!type.is_alphabetL(name)) throw new RunnerException("only alphabet can be variable's identifier",{"line_number": i, "line" : line});
                    var_table.set(name,value);
                    Memory.set(value,Memory.segment.data.ptr);
                    var_table.set(name,Memory.segment.data.ptr++);
                } else throw new RunnerException("unknown segment",{"line_number": i, "line" : line});
            }
        }
        if(label_p != null) {
            label_p.setEndPoint(Memory.segment.code.ptr);
        }
        if(enter_point === null) throw new RunnerException("no entery point label _start",{});
        command_function = command_function(Memory,Register,label_table,var_table,RunnerException);
        this.execute(enter_point);
    };
    Runner.run("program.envs");
})();