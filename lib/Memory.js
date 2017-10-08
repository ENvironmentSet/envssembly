/**
 * Created by environmentset on 17. 10. 6.
 */
var memory = ( () => {
    var Exception = require ('./Exception.js');
    var Memory_Array = new Array(0x10000);
    var Memory_ptr = 0x0000;

    var segment = {
        "code": {
            "start": 0x0000,
            "end": 0x8FFF,
            "ptr": 0
        },
        "data": {
            "start": 0x9000,
            "end": 0xAFFF,
            "ptr":0x9000
        },
        "bss": {
            "start": 0xB000,
            "end": 0xCFFF,
            "ptr":0xB000
        },
        "stack": {
            "start": 0xD000,
            "end": 0xFFFF
        }
    };

    class MemoryException extends Exception {
        constructor (msg,self) {
            super(msg);
            this.self = self;
        }

        toString () {
            return `MemoryException : ${this.constructor.constructor.toString.call(this)} \n ${this.self}`;
        }
    }

    //memory (16bit)
    //code  0x0000~0x8FFF
    //data  0x9000~0xAFFF
    //bss   0xB000~0xCFFF
    //stack 0xD000~0xFFFF

    // 8bit = 1byte *2 = word *2 = dword *2 = qword

    // code segment 접근제한 필요.

    //@param Number [ptr]
    //@return Number value
    function get (ptr = Memory_ptr) {
        return Memory_Array[ptr];
    }
    //@param Number [value] Number [ptr]
    function set (value,ptr = Memory_ptr) {
        Memory_Array[ptr] = value;
    }
    //@return Number value
    function read () {
        return Memory_Array[Memory_ptr++];
    }
    //@param Number value
    function write (value) {
        Memory_Array[Memory_ptr++] = value;
    }

    function get_ptr () {
        return Memory_ptr;
    }

    return {
        "segment":segment,
        "get":get,
        "set":set,
        "read":read,
        "write":write,
        "get_ptr":get_ptr,
        "Exception":MemoryException
    }
})();

module.exports = memory;