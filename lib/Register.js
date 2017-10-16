/**
 * Created by environmentset on 17. 10. 6.
 */
var register = {
    "ax":0x0000,
    "cx":0x0000,
    "dx":0x0000,
    "si":0x0000,
    "di":0x0000,
    "bx":0x0000,
    "bp":0x0000,
    "sp":0x0000,
    "ip":0x0000,
    "cs":0x0000,
    "ds":0x0000,
    "bs":0x0000,
    "ss":0x0000
};

register.flags = {
    "OF":false,
    "DF":false,
    "SF":false,
    "ZF":false,
    "PF":false,
    "CF":false,
    "ED":false
};

module.exports = register;