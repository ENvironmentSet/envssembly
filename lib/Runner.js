/**
 * Created by environmentset on 17. 10. 5.
 */


var Runner = ( () => {
    //파일 시스템 로딩 (코드 파일 로딩용)
    var fs = require('fs');
    //에러 처리 생성자 함수 로딩
    var Exception = require('./Exception.js');
    //문자열 해석할 lexer ( decode 함수)에서 사용할 문자열 다루는 버퍼 로딩
    var StringBuffer = require('./StringBuffer.js');
    //lexer에서 문법 형식에 알맞은지 체크용도
    var type = require('./typeCheck.js');

    //16비트 메모리 로딩
    var Memory = require('./Memory.js'); // 16bit
    //레지스터, 플레그 로딩
    var Register = require('./Register.js');
    //각 opcode에 대응하는 함수들을 가진 테이블 로딩
    var command_function = require("./command_function.js");

    //라벨을 이름:주소 형식으로 저장하는 테이블
    var label_table = new Map(); // label_name : code ptr
    //변수를 이름:주소 형식으로 저장하는 테이블
    var var_table = new Map(); // variable_name : memory_ptr
    // opcode 인코드, 디코드 모듈
    var opcode = require("./cmd_opcode.js");

    //@return Array utf8 code
    //문자열을 utf8코드로 바꾸고, 배열로 만들어서 리턴
    String.prototype.intCarr = function () {
        var result = [];
        for(var i = 0,len = this.length;i < len;i++) {
            result.push(this.charCodeAt(i));
        }
        return result;
    };

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
        var result = {
            "mne":"blank",
            "left":"blank",
            "right":"blank"
        };
        if(line[line.length-1] === ":") { // 라벨일경우
            let label_name = line.substr(0,line.length-2);
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
        let adr = 0;
        if(token.mne === "label") {

        } else if (opcode.c_table.has(token.mne)) {

        }

        return adr+Memory.segment.code.ptr;
    }

    //@param Number Address_entry_point
    function execute (entry_p) {
        Register.bp = Memory.segment.stack.end;
        Register.sp = Memory.segment.stack.end;
        Register.cs = Memory.segment.code.start;
        Register.bs = Memory.segment.bss.start;
        Register.ds = Memory.segment.data.start;
        Register.ss = Memory.segment.stack.start;
        Register.ip = entry_p;
        while(!Register.flags.ED) {

        }
    }

    //@param String [filename]
    function Run (filename) {
        //코드 리딩
        var code = fs.readFileSync(__dirname+'/../'+filename,'utf8');
        //줄 단위로 코드를 잘라 배열에 저장
        var lines = code.split('\n');

        //현재 처리중인 라인이 속한 세그먼트 이름
        var segment = null;
        //현재 처리중인 코드가 속한 라벨 이름
        var label_p = null;

        //프로그램이 실행될 떄 제일 먼처 실행될 코드 (엔트리 포인트)의 주소
        var enter_point = null;

    }
})();

module.exports = Runner;