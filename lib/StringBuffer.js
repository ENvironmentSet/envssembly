/**
 * Created by environmentset on 17. 10. 5.
 */
var Stringbuffer = ( () => {
    //예외 처리 생성자 함수 로드
    var Exception = require ('./Exception.js');
    //문자열이 그 문법의 형식에 맞는지 체크하기 위한 모듈 로딩
    var type = require ('./typeCheck.js');

    /*
    * @param
    * String [name],String [msg],Object StringBuffer [buffer]
    * @return Object StringBufferException
    * 버퍼 예외 출력.
    * */
    class StringBufferException extends Exception {
        constructor (msg,buffer) {
            super(msg);
            this.self = JSON.stringify(buffer) | "No Buffer info";
        }

        toString () {
            return `StringBufferException : ${this.constructor.constructor.toString.call(this)} \n ${this.self}`;
        };
    }
    /*
    * @param
    * String [s]
    * @return
    * Object StringBuffer
    * 문자열을 파라미터로 받으며 , 받은 문자열을 한 글자씩 읽을 수 있게 Generator 객체를 만들어준다. (function* 쓰란말이야아아악)
    * */

    class StringBuffer {
        constructor (s) { // s = string
            //문자열
            this.s = typeof s==="string" ? s : "";
            //포인터
            this.ptr = 0;
        }
        //@return boolean is_readAble
        //버퍼가 현재 읽을 수 있는 상태인지 확인합니다.
        check () {
            return this.ptr<=this.s.length-1;
        }
        //@return String
        //포인터를 앞으로 이동시키지 않고 문자열을 가져옵니다.
        ncread () {
            if(!this.check()) throw new StringBuffer("Buffer is empty",this);
            return this.s[this.ptr];
        }
        //@return String
        //문자열을 가져온 뒤에 포인터를 이동시킵니다
        read () {
            if(!this.check()) {
                throw new StringBuffer("Buffer is empty",this);
            }
            return this.s[this.ptr++];
        }
        //@return String
        //포인터의 값을 1 줄이고 문자열을 가져옵니다.
        unread () {
            if(this.ptr<=0) throw new StringBuffer("Buffer pointer is point 0.",this);
            return this.s[--this.ptr];
        }
        //@param String [s]
        //@return String [s]
        //파라미터 s 문자열을 현재 문자열 뒤에 이어붙입니다.
        add (s) {
            this.s+=s;
            return s;
        }
        //@return String
        //공백이 아닌 문자가 나올떄까지 포인터를 이동시킵니다.
        trim () {
            while(this.check()) {
                if(!type.is_blank(this.ncread())) break;
                    this.ptr++;
            }
        }
        //@param String [s]
        //객체를 초기화 합니다.
        init (s) {
            this.s = typeof s==="string" ? s : "";
            this.ptr = 0;
        }
        //@return String numbers
        //버퍼에서 숫자가 아닌 문자가 나올때까지 문자를 읽고 읽은 것을 반환합니다 . 없을시 null을 반환합니다.
        get_number () {
            let result = "";
            this.trim();
            if(!this.check()) {
                throw new StringBufferException("empty Buffer",this);
            } else if (!type.is_digit(this.ncread())) {
                throw new StringBufferException("invalid number",this);
            }

            while(this.check()&&type.is_digit(this.ncread())) {
                result += this.read();
            }
            return type.is_digitL(result) ? result : null;
        }
        //@return String identifier
        //버퍼에서 식별자가 아닌 문자가 나올때까지 문자를 읽고 읽은 것을 반환합니다 . 없을시 null을 반환합니다.
        get_identifier () {
            let result = "";
            this.trim();
            if(!this.check()) {
                throw new StringBufferException("empty Buffer",this);
            } else if (!type.is_Identifiler(this.ncread())) {
                throw new StringBufferException("invalid Identifiler",this);
            }

            while(this.check()&&type.is_Identifiler(this.ncread())) {
                result += this.read();
            }
            return type.is_IdentifilerL(result) ? result : null;
        }
        //@return String Memory
        //버퍼에서 메모리 연산이 아닌 문자가 나올때까지 문자를 읽고 읽은 것을 반환합니다 . 없을시 null을 반환합니다.
        get_Memory () {
            let result = "";
            this.trim();
            if(!this.check()) {
                throw new StringBufferException("empty Buffer",this);
            } else if (!type.is_Memory_CHAR(this.ncread())) {
                throw new StringBufferException("invalid Memory expression",this);
            }

            while(this.check()&&type.is_Memory_CHAR(this.ncread())) {
                result += this.read();
            }
            return type.is_MemoryL(result) ? result : null;
        }
        //@return string
        //버퍼에서 문자열이 끝날떄까지 문자를 읽고 읽은 것을 반환합니다 . 없을시 null을 반환합니다.
        get_string () {
            let result = "";
            this.trim();
            if(!this.check()) {
                throw new StringBufferException("empty Buffer",this);
            } else if (this.ncread() !== "\"") {
                throw new StringBufferException("invalid String operator",this);
            }

            do {
                result += this.read();
                if(this.ncread()==="\"") {
                    result+=this.read();
                    break;
                }
            }
            while(this.check()&&this.ncread()!==" ")
            return type.is_StringL(result) ? result : null;
        }
        //@return operator
        //버퍼의 포인터가 가르키는 문자가 , 가 아니면 null을 맞으면 읽어들인 ,을 반환합니다
        get_operator () {
            this.trim();
            if(!this.check()) {
                throw new StringBufferException("empty Buffer",this);
            }  else if (this.ncread() !== ",") {
                throw new StringBufferException("invalid operator",this);
            }
            return this.read();
        }
        //@return String token
        // 공백은 무시하고 다음 문자열이 메모리 연산,숫자,식별자,문자열,연산자인지 확인하고 맞으면 그 형식을 읽어들이는 메서드를 통해 읽은 다음 반환합니다.
        get_token () {
            try {
                this.trim();
                if(!this.check()) throw new StringBufferException("empty buffer",this);
                var s = this.ncread();
                if(type.is_digit(s)) {
                    s = this.get_number();
                } else if (type.is_Identifiler(s)) {
                    s = this.get_identifier();
                } else if (s === "[") {
                    s = this.get_Memory();
                } else if (s === "\"") {
                    s = this.get_string();
                } else {
                    s = this.get_operator();
                }
                return s;
            } catch (e) {
                if(e instanceof Exception) {
                }
                return null;
            }
        }
    }
    return StringBuffer;
})();

module.exports = Stringbuffer;
