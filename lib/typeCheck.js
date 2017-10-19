/**
 * Created by environmentset on 17. 10. 5.
 */
//@param String [s]
///@return boolean is_digit
module.exports.is_digit = (s) => {
    var reg = /[0-9]/;
    return reg.test(s);
};
//@param String [s]
///@return boolean is_digit
module.exports.is_digitL = (string) => {
    var reg = /[0-9]/;
    return reg.test(string)?!/[^0-9]/.test(string) : false;
};

//@param String [s]
///@return boolean is_alphabet
module.exports.is_alphabet = (s) => {
    var reg = /[a-zA-Z]/;
    return reg.test(s);
};
//@param String [s]
///@return boolean is_alphabet
module.exports.is_alphabetL = (string) => {
    var reg = /[a-zA-Z]/;
    return reg.test(string)?!/[^a-zA-Z]+/.test(string) : false;
};
//@param String [s]
///@return boolean is_String liter
module.exports.is_StringL = (string) => {
    var reg = /^".*"$/;
    return reg.test(string);
};

//@param String [s]
///@return boolean is_blank
module.exports.is_blank = (s) => {
    var reg = / |\t/;
    return reg.test(s);
};
//@param String [s]
///@return boolean Memory_input
module.exports.is_Memory = (string) => {
    var reg = /\[|\]|\+|-|[a-zA-Z]|[0-9]/;
    return reg.test(string);
};
//@param String [s]
///@return boolean Memory_expression
module.exports.is_mem = (string) => {
    var reg = /\[(\+|-|[a-zA-Z]*|[0-9])*\]/;
    return reg.test(string);
};
//@param String [s]
///@return boolean is_register
module.exports.is_Register = (s) => {
    var reg = /ax|cx|dx|si|di|bx|bp|sp|ip/;
    return reg.test(s);
};

module.exports.is_operator = (s) => {
    var reg = /\+|-|\/|\*|,/;
    return reg.test(s);
};