/**
 * Created by environmentset on 17. 10. 6.
 */
var memory = ( () => {
    //오류 제어용 함수 로딩
    let Exception = require ('./Exception.js');
    //메모리 공간 할당
    let Memory_Buffer = new ArrayBuffer(0x10000);
    //byte 단위 뷰
    let Memory_byte = new Uint8Array(Memory_Buffer);
    //word 단위 뷰
    //var Memory_word = new Uint16Array(Memory_Buffer);
    //메모리 포인터
    let Memory_ptr = 0x0001;

    let segment = {
        "code": {
            "start": 0x0001,
            "end": 0x8FFF,
            "ptr": 1
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
        constructor (msg) {
            super(msg);
        }

        toString () {
            return `MemoryException : ${this.constructor.constructor.toString.call(this)}`;
        }
    }

    //memory (16bit)
    //code  0x0000~0x8FFF
    //data  0x9000~0xAFFF
    //bss   0xB000~0xCFFF
    //stack 0xD000~0xFFFF

    // 8bit = 1byte *2 = word *2 = dword *2 = qword

    // code segment 접근제한 필요.

    //@param Number ptr
    //읽을 바이트가 존재하는 주소를 인자로 받고 그 주소의 값을 넘김
    function get_byte (ptr) {
        return Memory_byte[ptr];
    }
    //@param Number value, Number ptr
    //메모리에 ptr 에 value를 써넣음 (1바이트만큼만)
    function set_byte (value,ptr) {
        Memory_byte[ptr] = value & 0xFF;
    }
    //포인터가 가르키는 메모리에서 값을 읽고 포인터를 1 늘림
    function read_byte () {
        return Memory_byte[Memory_ptr++];
    }
    //포인터가 가르키는 메모리에 값을 쓰고 포인터를 1 늘림
    function write_byte (value) {
        Memory_byte[Memory_ptr++] = value & 0xFF;
    }
    //@param Number ptr
    //읽을 워드가 존재하는 주소를 인자로 받고 그 주소의 값을 넘김
    function get_word (ptr) {
        let byte1 = get_byte(ptr);
        let byte2 = get_byte(ptr+1);
        return (byte1 << 8) | byte2;
    }
    //@param Number value, Number ptr
    //메모리에 ptr 과 ptr+1에  value를 바이트 단위로 나눈 뒤  써넣음 (2바이트만큼만) (리틀 엔디안)
    function set_word (value,ptr) {
        set_byte((value >> 8) & 0xFF ,ptr);
        set_byte(value & 0xFF,ptr+1);
    }
    //포인터가 가르키는 메모리에서 값을 읽고 포인터를 2 늘림
    function read_word () {
        let byte1 = get_byte(Memory_ptr);
        let byte2 = get_byte(Memory_ptr++);
        Memory_ptr++;
        return (byte1 << 8) | byte2;
    }
    //포인터가 가르키는 메모리에 값을 쓰고 포인터를 2 늘림
    function write_word (value) {
        set_byte((value >> 8) & 0xFF ,Memory_ptr);
        set_byte(value & 0xFF,Memory_ptr++);
        Memory_ptr++;
    }

    return {
        "segment":segment,
        "Exception":MemoryException,
        "set_byte":set_byte,
        "get_byte":get_byte,
        "read_byte":read_byte,
        "write_byte":write_byte,
        "set_word":set_word,
        "get_word":get_word,
        "read_word":read_word,
        "write_word":write_word
    };
})();

module.exports = memory;