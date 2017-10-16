/**
 * Created by environmentset on 17. 10. 16.
 */

var opcode_t = ( () => {
    //lexer에서 문법 형식에 알맞은지 체크용도
    var type = require('./typeCheck.js');
    //문자열 해석할 lexer ( decode 함수)에서 사용할 문자열 다루는 버퍼 로딩
    var StringBuffer = require('./StringBuffer.js');
    /*
    * num16 === Uint16
    * num8 === Uint8
    * reg === register [si,di,bx,bp,sp,cs,bs,ds,ss]
    * mati === +,-,/,*
    * */
    var opcode_table = new Map({
        "0" : "blank",
        "1" : "ax",
        "2" : "bx",
        "3" : "cx",
        "4" : "dx",
        "5" : "si",
        "6" : "di",
        "7" : "bp",
        "8" : "sp",
        "9" : "ip",
        "10" : "cs",
        "11" : "ds",
        "12" : "bs",
        "13" : "ss",
        "14" : "exit",
        "15" : "emucall",
        "16" : "mov",
        "17" : "add",
        "18" : "lea",
        "19" : "push",
        "20" : "pop",
        "21" : "sub",
        "22" : "ret",
        "23" : "jmp",
        "251" : "[num16]",
        "252" : "[num8]",
        "253" : "[reg]",
        "254" : "[reg,mati,num16]",
        "255" : "[reg,mati,num8]"
    });

    var c_table = new Map({
        "blank" : 0,
        "ax" : 1,
        "bx" : 2,
        "cx" : 3,
        "dx" : 4,
        "si" : 5,
        "di" : 6,
        "bp" : 7,
        "sp" : 8,
        "ip" : 9,
        "cs" : 10,
        "ds" : 11,
        "bs" : 12,
        "ss" : 13,
        "exit" : 14,
        "emucall" : 15,
        "mov" : 16,
        "add" : 17,
        "lea" : 18,
        "push" : 19,
        "pop" : 20,
        "sub" : 21,
        "ret" : 22,
        "jmp" : 23,
        "[num16]" : 251,
        "[num8]" : 252,
        "[reg]" : 253,
        "[reg,mati,num16]" : 254,
        "[reg,mati,num8]" : 255
    });

    //@param Object token
    //@return Array opcodes
    function encode (token) {
        let result = [];
        result.push(c_table.get(token.mne));
        if(!type.is_mem(token.left)) {
            let operand = new StringBuffer(token.left.substr(1,token.left.length-2));
        } else {
            result.push(c_table.get(token.left));
        }
        if(!type.is_mem(token.right)) {
            let operand = new StringBuffer(token.right.substr(1,token.right.length-2));
        } else {
            result.push(c_table.get(token.right));
        }
        return result;
    }

    //@param Array opcodes
    //@param Object token
    function decode (opcode_arr) {

    }

    return {
        "op_table":opcode_table,
        "c_table":c_table,
        "encode":encode,
        "decode":decode
    }
})();

module.exports = opcode_t;