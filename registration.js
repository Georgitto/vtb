function getUserData() {

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    let userName = document.getElementById('log').value;
    let userPassword = document.getElementById('pass').value;
    let secretWord = document.getElementById('word').value;
    let max_length = 20;

    let word_hash = get_hash(secretWord, max_length);
    let token = userName + userPassword;
    let key = get_random_string(token.length);
    let secret_token = xor(token, key);
    let secret_key = concat_key_with_random(key, word_hash, max_length);
    let exctracted_key =  extract_key_by_word(secret_key, secret_token.length, secretWord, max_length);
    let decoded_token = xor(secret_token, exctracted_key);

    console.log("Токен: " + token);
    console.log("Хэш от секретного слова: " + word_hash);
    console.log("Ключ, созданный на длине токена: " + key);
    console.log("Скрытый токен: " + secret_token);
    console.log("Скрытый ключ: " + secret_key);
    console.log("Полученный ключ: " + exctracted_key);
    console.log("Полученный токен: " + decoded_token);

    let random_id = generateId();
    add_to_cookie('randId', random_id);
    add_to_cookie('secretToken', secret_token);
    add_key_to_server(random_id, secret_key);
}

function generateId() {
    return Math.round(Math.random() * 1000000);
}

function add_to_cookie(key, value) {
    document.cookie = `${encodeURIComponent(key)} = ${encodeURIComponent(value)}`;
}

function add_key_to_server(id, secret_key) {
    let body = {
        id: id,
        key: secret_key
    }
    body = JSON.stringify(body);

    let xhr = new XMLHttpRequest();
    xhr.open('POST','http://89.223.94.132:8000/key', false);
    xhr.send(body);
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        }
    };
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
    console.log(JSON.parse(xh.response).key);
}

function get_hash(word, max_length) {
    // let hash = 0
    // for (let i = 0; i < word.length; i++) {
    //     hash = (hash + word.charCodeAt(i) * 348937913) % max_length;
    // }
    // console.log('http://89.223.94.132:8000/hash?text=' + word);
    let xhr = new XMLHttpRequest();
    xhr.open('GET','http://89.223.94.132:8000/hash?text=' + word, false);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        }
    };
    let hash = JSON.parse(xhr.response);
    return hash.hash;
}

function get_random_string(length) {
    let random_string = ""
    for (let i = 0; i < length; i++) {
        random_string += get_random_char();
    }
    return random_string;
}

function get_random_char() {
    let i = Math.random() * 1000 % 128;
    return String.fromCharCode(i);
}

function concat_key_with_random(key, length, max_length) {
    let secret_key = "";
    secret_key += get_random_string(length);
    secret_key += key;
    secret_key += get_random_string(max_length - length);
    return secret_key;
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
    let word_hash = get_hash(word, max_length)
    return secret_key.substr(word_hash, word_hash + key_length)
}