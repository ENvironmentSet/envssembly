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

    }
    //@param Object token [command]
    //@return Int [address]
    function append (token) {

    }

    //@param Number Address_entry_point
    function execute (entry_p) {

    }

    //@param String [filename]
    function Run (filepath) {
        let code = fs.readFileSync(filepath,'utf8');
        let lines = code.split('\n');
        let segment = null;
        let label_p = null;
        let enter_point = null;

        for(let i = 0,len = lines.length; i < len;i++) {
            let line = fetch(lines, i);
        }
        let t = new StringBuffer(" 1234567 abcdefg , \"hi_there\" [12+ax-1]");
        console.log(t.get_token())
        console.log(t.get_token())
        console.log(t.get_token())
        console.log(t.get_token())
        console.log(t.get_token())
    }

    return Run;
})();

module.exports = Runner;