/**
 * Created by environmentset on 17. 10. 16.
 */

var opcode_t = ( (char_table) => {
    //lexer에서 문법 형식에 알맞은지 체크용도
    let type = require('./typeCheck.js');
    //문자열 해석할 lexer ( decode 함수)에서 사용할 문자열 다루는 버퍼 로딩
    let StringBuffer = require('./StringBuffer.js');
    let Exception = require('./Exception.js');
    class OpcodeException extends Exception {
        constructor (msg) {
            super(msg);
        }

        toString () {
            return `OpcodeException : ${this.constructor.constructor.toString.call(this)}`;
        }
    }
    /*
    * num16 === Uint16
    * num8 === Uint8
    * reg === register [si,di,bx,bp,sp,cs,bs,ds,ss]
    * mati === +,-,/,*
    * */
    let opcode_table = ["blank","ax","bx","cx","dx","si","di","bp","sp","ip","cs","ds","bs","ss",
        "exit","emucall","mov","add","lea","push","pop","sub","ret","jmp","label","+","-","*","/",...new Array(225),
        "char_variable","cmd_end","8bitI","16bitI","STRING","[memory_exp]"];

    class MemoryExpression {
        constructor (num = 0,mati = 25,mem = 0) {
            this.num = num;
            this.mati = mati;
            this.mem = mem;
        }
    }

    //@param Object token
    //@return Array opcodes
    function encode (token) {
        let result = [];
        result.push(opcode_table.indexOf(token.mne),0);
        if(type.is_StringL(token.left)) {
            let operand = token.left.substr(1,token.left.length-2).intCarr().reverse(); // remov ""
            result.push(254,...operand,0);
        } else if (type.is_digitL(token.left)) {
            let operand = token.left >>> 0;
            if(operand <= 255) { // 8bit
                result.push(252,operand & 0xFF,0);
            } else if (operand <= 65535) { // 16bit
                result.push(253,(operand >> 8) & 0xFF,operand & 0xFF,0);
            } else throw new OpcodeException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
        } else if (type.is_mem(token.left)) {
            let operand = new StringBuffer(token.left.substr(1,token.left.length-2));
            //lex
            result.push(255);
            while(operand.check()) {
                let item = operand.get_token();
                if(type.is_digitL(item)) {
                    item >>= 0;
                    if(item <= 255) { // 8bit
                        result.push(252,item & 0xFF,0);
                    } else if (item <= 65535) { // 16bit
                        result.push(253,(item >> 8) & 0xFF,item & 0xFF ? item & 0xFF : 1,0);
                    } else throw new OpcodeException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
                } else if (char_table.has(item)) {
                    let a = char_table.get(item);
                    if(a <= 255) { // 8bit
                        result.push(250,a & 0xFF,0);
                    } else if (a <= 65535) { // 16bit
                        result.push(250,(a >> 8) & 0xFF,a & 0xFF ? a & 0xFF : 1,0);
                    }
                } else {
                    result.push(opcode_table.indexOf(item));
                }
            }
            result.push(0);
        } else if(type.is_Register(token.left)){
            let cp = opcode_table.indexOf(token.left);
            result.push(cp > 0 ? cp : 0,0);
        } else if(char_table.has(token.left)) {
            let a = char_table.get(token.left);
            if(a <= 255) { // 8bit
                result.push(250,a & 0xFF,0);
            } else if (a <= 65535) { // 16bit
                result.push(250,(a >> 8) & 0xFF,a & 0xFF ? a & 0xFF : 1,0);
            } else throw new OpcodeException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
        } else result.push(0);

        if(type.is_StringL(token.right)) {
            let operand = token.right.substr(1,token.right.length-2).intCarr().reverse(); // remov ""
            result.push(254,...operand,0);
        } else if (type.is_digitL(token.right)) {
            let operand = token.right >>> 0;
            if(operand <= 255) { // 8bit
                result.push(252,operand & 0xFF,0);
            } else if (operand <= 65535) { // 16bit
                result.push(253,(operand >> 8) & 0xFF,operand & 0xFF,0);
            } else throw new OpcodeException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
        } else if (type.is_mem(token.right)) {
            let operand = new StringBuffer(token.right.substr(1,token.right.length-2));
            //lex
            result.push(255);
            while(operand.check()) {
                let item = operand.get_token();
                if(type.is_digitL(item)) {
                    item >>= 0;
                    if(item <= 255) { // 8bit
                        result.push(252,item & 0xFF,0);
                    } else if (item <= 65535) { // 16bit
                        result.push(253,(item >> 8) & 0xFF,item & 0xFF ? item & 0xFF : 1,0);
                    } else throw new OpcodeException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
                } else if (char_table.has(item)) {
                    let a = char_table.get(item);
                    if(a <= 255) { // 8bit
                        result.push(250,a & 0xFF,0);
                    } else if (a <= 65535) { // 16bit
                        result.push(250,(a >> 8) & 0xFF,a & 0xFF ? a & 0xFF : 1,0);
                    } else throw new OpcodeException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
                } else {
                    result.push(opcode_table.indexOf(item));
                }
            }
            result.push(0);
        } else if(type.is_Register(token.right)){
            let cp = opcode_table.indexOf(token.right);
            result.push(cp > 0 ? cp : 0,0);
        } else if(char_table.has(token.right)) {
            let a = char_table.get(token.right);
            if(a <= 255) { // 8bit
                result.push(250,a & 0xFF,0);
            } else if (a <= 65535) { // 16bit
                result.push(250,(a >> 8) & 0xFF,a & 0xFF ? a & 0xFF : 1,0);
            } else throw new OpcodeException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
        } else result.push(0);
        result.push(251);
        return result;
    }

    //@param Array opcodes
    //@return Object execute_able_command
    function decode (opcode_arr) {
        let num;
        let mem;
        let mati;
        let item;
        let result = {};
        result.mnemonic = toString(fetch(opcode_arr));
        result.left = toString(fetch(opcode_arr));
        result.right = toString(fetch(opcode_arr));
        return result;
    }

    function fetch (arr) {
        let item;
        let items = [];
        while((item = arr.shift()) != 0) {
            if(item === undefined) throw new OpcodeException("command fetch error, infinity-length cmd");
            items.push(item);
        }
        return items;
    }

    function toString (op_arr) {
        let item;
        let flag = "code";
        let memf = false;
        let strf = false;
        let varif = false;
        let result;
        while(op_arr.length) {
            item = op_arr.shift();
            if(item === 252) { //8bit Num
                flag = "8bitI";
            } else if (item === 253) { // 16bit Num
                flag = "16bitI";
            } else if (item === 254) { // String
                flag = "STRING";
            } else if (item === 255) { // Memory_expressions
                flag = "[memory_exp]";
                memf = true;
            } else if(item === 250) {
                flag = "char_variable";
            } else {
                switch (flag) {
                    case "8bitI":
                        result = item;
                        break;
                    case "16bitI":
                        result = (item << 8) | op_arr.shift()-1;
                        break;
                    case "STRING":
                        if(result === undefined) result = "\"";
                        strf = true;
                        result += String.fromCharCode(item);
                        break;
                    case "[memory_exp]":
                        if(result === undefined) result = "[";
                        result += opcode_table[item];
                        break;
                    case "char_variable":
                        varif = true;
                        if(op_arr[0]){
                          result = (item << 8) | op_arr.shift()-1;
                        } else result = item;
                        break;
                    default : // mne
                            result = opcode_table[item];
                }
            }
        }
        if(memf) result+="]";
        if(strf) {
            result+="\"";
            result = result.split("").reverse().join("");
        }
        if(varif) result = char_table.getNameByAddress(result);
        return result;
    }

    return {
        "opcode_table":opcode_table,
        "encode":encode,
        "decode":decode
    }
});

module.exports = opcode_t;