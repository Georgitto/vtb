
function resolveTransfer() {
    let randId = get_data_from_cookie('randId');
    let secretToken = decodeURIComponent(get_data_from_cookie('secretToken'));
    let secretKey = get_key_from_server(randId);
    let secretWord = prompt("Введите свое секретное слово: ");
    let extractedKey =  extract_key_by_word(secretKey, secretToken.length, secretWord, 20); //при проверке изменить последний параметр на 180000
    let decodedToken = xor(secretToken, extractedKey);
    console.log("extractedKey: "+extractedKey);
    console.log("decodeToken: "+decodedToken);
}

function get_data_from_cookie(key) {
    let result = document.cookie.split(';');
    let index = -1;

    result.map(function (el) {
        if (el.indexOf(key) !== -1)
            index = el.indexOf(key);
    });

    return result[index].split('=')[1];
}

function get_key_from_server(id) {
    let xh = new XMLHttpRequest();
    xh.open('GET','http://89.223.94.132:8000/key/' + id, false);
    xh.send();
    xh.onload = function() {
        if (xh.status != 200) {
            alert(`Ошибка ${xh.status}: ${xh.statusText}`);
        }
    };
    return JSON.parse(xh.response).key;
}

function xor(s1, s2) {
    let res = "";

    for (let i = 0; i < s1.length; i++){
        let e1 = s1.charCodeAt(i);
        let e2 = s2.charCodeAt(i);
        res += String.fromCharCode(e1 ^ e2);
    }

    return res;
}

function extract_key_by_word(secret_key, key_length, word, max_length) {
    let word_hash = get_hash_from_server(word, max_length);
    return secret_key.substr(word_hash, key_length);
}

function get_hash_from_server(word, max_length) {
    // let hash = 0
    // for (let i = 0; i < word.length; i++) {
    //     hash = (hash + word.charCodeAt(i) * 348937913) % max_length;
    // }

    let xhr = new XMLHttpRequest();
    xhr.open('GET','http://89.223.94.132:8000/hash?text=' + word, false);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        }
    };
    let hash = JSON.parse(xhr.response);
    console.log("Hash: "+hash.hash % max_length);
    return hash.hash % max_length;
}