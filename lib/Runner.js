/**
 * Created by environmentset on 17. 10. 5.
 */


var Runner = ( () => {
    String.prototype.intCarr = function () {
        var result = [];
        for(var i = 0,len = this.length;i < len;i++) {
            result.push(this.charCodeAt(i));
        }
        return result;
    };
    class address_table extends Map {
        constructor (iter) {
            super(iter);
        }

        getNameByAddress (address) {
            let box = this.entries();
            for(let i of box) {
                if(i[1] === address) return i[0]
            }
            return "main";
        }
    }
    //파일 시스템 로딩 (코드 파일 로딩용)
    let fs = require('fs');
    //에러 처리 생성자 함수 로딩
    let Exception = require('./Exception.js');
    //문자열 해석할 lexer ( decode 함수)에서 사용할 문자열 다루는 버퍼 로딩
    let StringBuffer = require('./StringBuffer.js');
    //lexer에서 문법 형식에 알맞은지 체크용도
    let type = require('./typeCheck.js');

    let Memory = require('./Memory.js');
    let Register = require('./Register.js');
    let char_address = new address_table();
    let command_function = require("./command_function.js")(Memory,Register,char_address);
    let opcode = require("./cmd_opcode.js")(char_address);

    class RunnerException extends Exception {
        constructor (msg) {
            super(msg);
        }

        toString () {
            return `RunnerException : ${this.constructor.constructor.toString.call(this)}`;
        }
    }


    //@param Commands Array [line] Number [index]
    //@return String command
    //한 줄을 가져와서 양 옆 공백 제거 후 리턴
    function fetch (line,index) {
        return line[index].trim();
    }

    //@param String line
    //@return Object token
    //한 줄을 입력받고 이를 해석해서 토큰 형식으로 반환
    function decode (line) {
        // asm code looks like [label:] [mnemonic [operands]]
        let result = {
            "mne":"blank",
            "left":"blank",
            "right":"blank"
        };

        if(line[line.length-1] === ":") { // 라벨일경우
            let label_name = line.replace(":","");
            if(!type.is_alphabetL(label_name)) throw new RunnerException("label name is Not a Alphabet line : "+line);
            result.mne = "label";
            result.left = label_name;
        } else { // 명령어인경우
            let Buffer = new StringBuffer(line);
            let monic = Buffer.get_identifier(),left,dash,right;

            if(!type.is_alphabetL(monic)) {
                throw new RunnerException("first word is not mnemonic line : "+line);
            }
            result.mne = monic;

            left = Buffer.get_token();

            if (left != null) {
                result.left = left;
                dash = Buffer.get_token();
                if(dash === ",") {
                    right = Buffer.get_token();
                    if(right === null) {
                        throw new RunnerException('syntax error; cannot find right operand line :'+line);
                    }
                    result.right = right;
                } else if (dash != null) {
                    throw new RunnerException('syntax error; right operand must be after comma(,) line :'+line);
                }
            }

        }
        return result;
    }
    //@param Object token [command]
    //@return Int [address]
    function append (token) {
        for(let i = 0,len = token.length; i < len;i++) {
            Memory.write_byte(token[i]);
            Memory.segment.code.ptr++;
        }
        return Memory.segment.code.ptr - token.length;
    }

    //@param Number Address_entry_point
    function execute (entry_p) {
        Register.ip = entry_p;
        while(!Register.flags.ED) {
            let code = opcode.decode(codeFetch());
            command_function[code.mnemonic](code.left,code.right);
        }
    }

    function codeFetch () {
        let result = [];
        let item;
        while((item = Memory.get_byte(Register.ip++)) != 251) {
            result.push(item);
        }
        return result;
    }

    //@param String [filename]
    function Run (filepath) {
        let code = fs.readFileSync(filepath,'utf8');
        let lines = code.split('\n');
        let segment = null;
        let label_p = null;
        let enter_point = null;

        for(let i = 0,len = lines.length; i < len;i++) {
            let line = fetch(lines,i);
            if (line.charAt(line.length - 1) === '\r') line = line.substr(0, line.length - 1);
            if(line === "" || line.charAt(0) === ";") continue;

            if(line.charAt(0) === ".") {
                segment = line;
                continue;
            }

            if(segment === ".code") {
                let token = decode(line);
                let opc = opcode.encode(token);
                let pos = append(opc);
                if(line.charAt(line.length-1) === ":") {
                    let label_name = line.replace(":","");
                    if(char_address.has(label_name)) throw new RunnerException("label is already exits");
                    if(label_name === "main") enter_point = pos;
                    label_p = pos;
                    char_address.set(label_name,label_p);
                } else if (label_p === null) throw new RunnerException("no label for code line :"+line);
            } else if(segment === ".data") {
                let item = new StringBuffer(line);
                let name = item.get_token();
                let value = item.get_token();
                Memory.set_byte(value,Memory.segment.data.start+Memory.segment.data.ptr);
                char_address.set(name,Memory.segment.data.ptr++);
            } else if (segment === ".bss") {
                let item = new StringBuffer(line);
                let name = item.get_token();
                Memory.set_byte(0,Memory.segment.data.start+Memory.segment.data.ptr);
                char_address.set(name,Memory.segment.data.ptr++);
            } else throw new RunnerException("No segment for line line :"+line);
        }
        if(enter_point != null) execute(enter_point);
    }

    return Run;
})();

module.exports = Runner;