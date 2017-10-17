/**
 * Created by environmentset on 17. 10. 5.
 */


var Runner = ( () => {
    //파일 시스템 로딩 (코드 파일 로딩용)
    let fs = require('fs');
    //에러 처리 생성자 함수 로딩
    let Exception = require('./Exception.js');
    //문자열 해석할 lexer ( decode 함수)에서 사용할 문자열 다루는 버퍼 로딩
    let StringBuffer = require('./StringBuffer.js');
    //lexer에서 문법 형식에 알맞은지 체크용도
    let type = require('./typeCheck.js');

    //16비트 메모리 로딩
    let Memory = require('./Memory.js'); // 16bit
    //레지스터, 플레그 로딩
    let Register = require('./Register.js');
    //각 opcode에 대응하는 함수들을 가진 테이블 로딩
    let command_function = require("./command_function.js");

    class RunnerException extends Exception {
        constructor (msg) {
            super(msg);
        }

        toString () {
            return `RunnerException : ${this.constructor.constructor.toString.call(this)}`;
        }
    }

    //변수, 라벨명 : 주소 형태로 저장
    let char_address = new Map();
    // opcode 인코드, 디코드 모듈
    let opcode = require("./cmd_opcode.js")(char_address,RunnerException);


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
        for(let i = 0,len = token.length; i < len;i++) {
            Memory.write_byte(token[i]);
            Memory.segment.code.ptr++;
        }
        return Memory.segment.code.ptr - token.length;
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
            //메모리에 올라간 코드를 읽고 디코드 함수 호출 -> 실행 .
        }
    }

    //@param String [filename]
    function Run (filename) {
        //코드 리딩
        let code = fs.readFileSync(__dirname+'/../'+filename,'utf8');
        //줄 단위로 코드를 잘라 배열에 저장
        let lines = code.split('\n');

        //현재 처리중인 라인이 속한 세그먼트 이름
        let segment = null;
        //현재 처리중인 코드가 속한 라벨 이름
        let label_p = null;

        //프로그램이 실행될 떄 제일 먼처 실행될 코드 (엔트리 포인트)의 주소
        let enter_point = null;
        //반복하며 줄 해석
        for(let i = 0,len = lines.length; i < len;i++) {
            //줄 가져오기
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
                    let label_name = line.substr(0,line.length-2);
                    if(char_address.has(label_name)) throw new RunnerException("label is already exits");
                    if(label_name === "main") enter_point = pos;
                    label_p = pos;
                } else if (label_p === null) throw new RunnerException("no label for code line :"+line);
            } else if(segment === ".data") {

            } else if (segment === ".bss") {

            } else throw new RunnerException("No segment for line line :"+line);
        }
        //execute(enter_point);
    }
    //testcase
    Run("program.envs");
})();

module.exports = Runner;