function get_hash(word) {
	let hash = 0
	for (let i = 0; i < word.length; i++) {
		hash += (word.charCodeAt(i) * 2348937913) % 1000000000;
	}
	return hash;
}

function concat_key_with_random(key, length, max_length) {
	let secret_key = ""
	secret_key += random_string(length)
	secret_key += key
	secret_key += random_string(max_length - length)
	return secret_key
}

function get_random_string(length) {
	let random_string = ""
	for (let i = 0; i < length; i++) {
		random_string += get_random_char();
	}
	return random_string;
}

function get_random_char() {
	let i = Math.random() * 1000 % 128
	return String.fromCharCode(i);
}
