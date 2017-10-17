/**
 * Created by environmentset on 17. 10. 16.
 */

var opcode_t = ( (char_table,RunnerException) => {
    //lexer에서 문법 형식에 알맞은지 체크용도
    let type = require('./typeCheck.js');
    //문자열 해석할 lexer ( decode 함수)에서 사용할 문자열 다루는 버퍼 로딩
    let StringBuffer = require('./StringBuffer.js');
    /*
    * num16 === Uint16
    * num8 === Uint8
    * reg === register [si,di,bx,bp,sp,cs,bs,ds,ss]
    * mati === +,-,/,*
    * */
    let opcode_table = ["blank","ax","bx","cx","dx","si","di","bp","sp","ip","cs","ds","bs","ss",
        "exit","emucall","mov","add","lea","push","pop","sub","ret","jmp","label","+","-","*","/",...new Array(226),
        "[memory_exp]"];

    String.prototype.intCarr = function () {
        var result = [];
        for(var i = 0,len = this.length;i < len;i++) {
            result.push(this.charCodeAt(i));
        }
        return result;
    };

    //@param Object token
    //@return Array opcodes
    function encode (token) {
        let result = [];
        result.push(opcode_table.indexOf(token.mne),0);
        if(type.is_StringL(token.left)) {
            let operand = token.left.substr(1,token.length-2).intCarr(); // remov ""
            result.push(...operand,0);
        } else if (type.is_digitL(token.left)) {
            let operand = token.left >>> 0;
            if(operand <= 255) { // 8bit
                result.push(operand & 0xFF,0);
            } else if (operand <= 65535) { // 16bit
                result.push((operand >> 8) & 0xFF,operand & 0xFF,0);
            } else throw new RunnerException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
        } else if (type.is_mem(token.left)) {
            let operand = new StringBuffer(token.left.substr(1,token.left.length-2));
            //lex
            result.push(255);
            while(operand.check()) {
                let item = operand.get_token();
                if(type.is_digitL(item)) {
                    item >>= 0;
                    if(item <= 255) { // 8bit
                        result.push(item & 0xFF,0);
                    } else if (item <= 65535) { // 16bit
                        result.push((item >> 8) & 0xFF,item & 0xFF,0);
                    } else throw new RunnerException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
                } else if (char_table.has(item)) {
                    result.push(char_table.get(item),0)
                } else {
                    result.push(opcode_table.indexOf(item),0)
                }
            }
            result.push(0);
        } else { // if register
            result.push(opcode_table.indexOf(token.left),0)
        }

        if(type.is_StringL(token.right)) {
            let operand = token.right.substr(1,token.length-2).intCarr(); // remov ""
            result.push(...operand,0);
        } else if (type.is_digitL(token.right)) {
            let operand = token.right >>> 0;
            if(operand <= 255) { // 8bit
                result.push(operand & 0xFF,0);
            } else if (operand <= 65535) { // 16bit
                result.push((operand >> 8) & 0xFF,operand & 0xFF,0);
            } else throw new RunnerException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
        } else if (type.is_mem(token.right)) {
            let operand = new StringBuffer(token.right.substr(1,token.right.length-2));
            //lex
            result.push(255);
            while(operand.check()) {
                let item = operand.get_token();
                if(type.is_digitL(item)) {
                    item >>= 0;
                    if(item <= 255) { // 8bit
                        result.push(item & 0xFF,0);
                    } else if (item <= 65535) { // 16bit
                        result.push((item >> 8) & 0xFF,item & 0xFF,0);
                    } else throw new RunnerException("Number is Bigger than 16-bit limit token :"+JSON.stringify(token));
                } else if (char_table.has(item)) {
                    result.push(char_table.get(item),0)
                } else {
                    result.push(opcode_table.indexOf(item),0)
                }
            }
            result.push(0);
        } else { // if register
            result.push(opcode_table.indexOf(token.right),0)
        }
        return result;
    }

    //@param Array opcodes
    //@return Object execute_able_command
    function decode (opcode_arr) {

    }

    return {
        "op_table":opcode_table,
        "encode":encode,
        "decode":decode
    }
});

module.exports = opcode_t;