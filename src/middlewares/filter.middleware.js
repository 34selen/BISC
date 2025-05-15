const fs = require("fs");
const path = require("path");

const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

const sql_filter = (data) => {
    const lower_data = data.toLowerCase();
    const filter = /@|\.|\(\)|col|if|case|when|sleep|benchmark|union|'|"|\\|select|-|#|;|0x|0u|0b|,/i;

    if (filter.test(lower_data)) {
        return "NO";
    } else {
        return data;
    }
}

const file_filter = (filename) => {
    const lower_name = filename.toLowerCase();
    const filename_filter = /secret_project_note|passwd|cwd|dev|env|etc|app|proc|opt|usr|bin|docker/;
    const lfi_filter = /\.\.|%/;

    const original_filename = path.basename(lower_name);

    if (original_filename.match(filename_filter)) return "NO";
    if (lower_name.match(lfi_filter)) return "NO";
    if (isNumber(original_filename)) return "NO";   

    return filename;
}

module.exports.sqli = sql_filter;
module.exports.file = file_filter;