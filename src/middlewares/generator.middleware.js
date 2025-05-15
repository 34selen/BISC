const path = require("path");

const id_generator = (id) => {
    const split_id = id.split("-");

    let gen_id = "";

    for (let i = 0; i < split_id.length; i++) {
        gen_id += split_id[i];
    }

    return gen_id;
}

const filename_generator = (opponent1, opponent2, chat_id) => {
    const concat_id = `${id_generator(opponent1)}_${id_generator(opponent2)}_${id_generator(chat_id)}`;

    const filename = concat_id + ".json";
    const filepath = path.join(__dirname, "../history/" + filename);

    return {
        filename,
        filepath
    };
}

module.exports.id = id_generator;
module.exports.filename = filename_generator;