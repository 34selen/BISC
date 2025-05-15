let lock = false;

async function acquireLock() {
  while (lock) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  lock = true;
}

function releaseLock() {
  lock = false;
}

function base64Encode(str) {
  return Buffer.from(str).toString('base64');
}

function base64Decode(str) {
  return Buffer.from(str, 'base64').toString();
}

class Search {
    constructor() {}

    isUseCommand(query) {
        if (query.indexOf("command: ") == 0) {
            return true;
        } else {
            return false;
        }
    }

    parseCommand(query) {
        // command: [CHECK_TEXT] OR command: [CHECK_TEXT]
        let command = "";

        try {
            command = query.split("command: ")[1].split("] ")[0];
        } catch {
            command = "[CHECK_TEXT]";
        }

        if (command.indexOf("CHECK_TEXT")) return "CHECK_TEXT";
        else if (command.indexOf("ALL_CHECK_TEXT")) return "ALL_CHECK_TEXT";
        else if (command.indexOf("SEARCH_TEXT")) return "CHECK_TEXT";
        else return "CHECK_TEXT";
    }

    check_text(chatJSON, query, isAllCheck=false) {
        const chats = JSON.parse(chatJSON);
        const findedIndex = [];
        const countFullIndex = [];
        
        try {
            query = query.split("command: ")[1].split("] ")[1];
        } catch {
            query = query;
        }

        for (let i = 1; i < chats.length; i++) {
            const message = chats[i].message;
            // You can never use wildcard characters in the search function. (Wild card search function to be developed later...)
            const query_filter = query.indexOf("*") != -1 ? query.replace(/\*/gi, "") : query;

            countFullIndex.push(i);

            if (message.indexOf(query_filter) != -1) findedIndex.push(true);
        }

        if (isAllCheck) {
            if (findedIndex.length == countFullIndex.length) return true;
            else return false;
        } else {
            if (findedIndex.length >= 1) return true;
            else return false;
        }
    }

    async search_text(chatJSON, query) {
        const chats = JSON.parse(chatJSON);
        const findedIndex = [];

        try {
            query = query.split("command: ")[1].split("] ")[1];
        } catch {
            query = query;
        }

        await acquireLock();
  
        for (let i = 1; i < chats.length; i++) {
            const message = chats[i].message;
            const query_filter = query.indexOf("*") != -1 ? query.replace(/\*/gi, "") : query;

            if (message.indexOf(query_filter) != -1) {
                findedIndex.push({
                    message: message,
                    index: message.indexOf(query),
                    chat_index: i,
                });


                // Preventing Race Conditions
                let tempStr = query;
                
                for (let j = 0; j < query.length; j++) {
                    tempStr = base64Encode(tempStr);
                    tempStr = base64Decode(tempStr);
                }
            }
        }
        
        releaseLock(); 

        return findedIndex;
    }
}

module.exports = Search;