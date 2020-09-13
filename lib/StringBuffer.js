// Inspired by JSCC's StringBuffer
// https://github.com/HDNua/JSCC/blob/master/StringBuffer.js
var Stringbuffer = ( () => {
    var Exception = require ('./Exception.js');
    var type = require ('./typeCheck.js');

    /*
    * @param
    * String [name],String [msg],Object StringBuffer [buffer]
    * @return Object StringBufferException
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
    * */

    class StringBuffer {
        constructor (s) { // s = string
            this.s = typeof s==="string" ? s : "";
            this.ptr = 0;
        }
        //@return boolean is_readAble
        check () {
            return this.ptr<=this.s.length-1;
        }
        //@return String
        ncread () {
            if(!this.check()) throw new StringBuffer("Buffer is empty",this);
            return this.s[this.ptr];
        }
        //@return String
        read () {
            if(!this.check()) {
                throw new StringBuffer("Buffer is empty",this);
            }
            return this.s[this.ptr++];
        }
        //@return String
        unread () {
            if(this.ptr<=0) throw new StringBuffer("Buffer pointer is point 0.",this);
            return this.s[++this.ptr];
        }
        //@param String [s]
        //@return String [s]
        add (s) {
            this.s+=s;
            return s;
        }
        //@return String
        trim () {
            while(this.check()) {
                if(!type.is_blank(this.ncread())) break;
                    this.ptr++;
            }
        }
        //@param String [s]
        init (s) {
            this.s = typeof s==="string" ? s : "";
            this.ptr = 0;
        }
        //@return String numbers
        get_number () {
            this.trim();
            if(!this.check()) {
                throw new StringBufferException("empty Buffer",this);
            } else if (!type.is_digit(this.ncread())) {
                throw new StringBufferException("invalid number",this);
            }
            var result = "";
            while(this.check()) {
                if (!type.is_digit(this.ncread())) break;
                result+=this.read();
            }
            return type.is_digitL(result) ? result : null;
        }
        //@return String identifier
        get_identifier () {
            this.trim();
            if(!this.check()) {
                throw new StringBufferException("empty Buffer",this);
            } else if (!type.is_alphabet(this.ncread())) {
                throw new StringBufferException("invalid identifier",this);
            }
            var result = "";
            while(this.check()) {
                if (!type.is_alphabet(this.ncread())) break;
                result+=this.read();
            }
            return type.is_alphabetL(result) ? result : null;
        }
        //@return String Memory
        get_Memory () {
            this.trim();
            if(!this.check()) {
                throw new StringBufferException("empty Buffer",this);
            } else if (!type.is_Memory(this.ncread())) {
                throw new StringBufferException("invalid Memory expression",this);
            }
            var result = "";
            while(this.check()) {
                if (!type.is_Memory(this.ncread())) break;
                result+=this.read();
            }
            return type.is_mem(result) ? result : null;
        }
        //@return string
        get_string () {
            this.trim();
            if(!this.check()) {
                throw new StringBufferException("empty Buffer",this);
            }
            var result = this.read();
            while(this.check()) {
                if (this.ncread() === "\"") {
                    result+=this.read();
                    break;
                }
                result+=this.read();
            }
            return type.is_StringL(result) ? result : null;
        }
        //@return operator
        get_operator () {
            this.trim();
            if(!this.check()) throw new StringBufferException("empty Buffer",this);
            var char = this.read();
            switch (char) {
                /*
                case '+' :
                    break;
                case '-' :
                    break;
                case '*' :
                    break;
                case '%' :
                    break;*/
                case ',' :
                    break;
                default :
                    throw new StringBufferException("invalid operator",this);
            }
            return typeof char === "string" ? char : null;
        }
        //@return String token
        get_token () {
            try {
                this.trim();
                if(!this.check()) throw new StringBufferException("empty buffer",this);
                var s = this.ncread();
                if(type.is_digit(s)) {
                    s = this.get_number();
                } else if (type.is_alphabet(s)) {
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
                } else return null;
            }
        }
    }
    return StringBuffer;
})();

module.exports = Stringbuffer;

//버퍼 체킹 강화 .
