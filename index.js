

	function capitalize(s){
		return s && s.charAt(0).toUpperCase() + s.substr(1);;
	}

	function smallize(s){
		return s && s.charAt(0).toLowerCase() + s.substr(1);
	}
	
	function optionalCapitalize(s, i){
		return i===0 ? s : capitalize(s);
	}
	
	function optionalLowerCamel(s, i){
		return i===0 ? smallize(s) : capitalize(s);
	}
	
	const regWords = /([A-Z]+(?![a-z\d])|[A-Z][a-z\d]+)/g;
	const regWord = /^([A-Z]+(?![a-z\d])|[A-Z][a-z\d]+)$/;
	const regAbbr = /^([A-Z]+(?![a-z\d])$/;
	
	function splitWords(s){
		let items = s.split(regWords).filter((a)=>(a));
		return items;
	}
	
	/**
	 * Разбивает строку по нескольким разделителям, получая вложенные массивы
	 * Элементарные строки после последнего разбиения обрабатывает функцией callback
	 */
	function recursiveSplit(str, levels, callback){
		let next = levels.slice(1), sep = levels[0];
		let items = str.split(sep);
		if(next.length){
			items = items.map(a=>recursiveSplit(a, next, callback));
		}
		else if(callback){
			items = items.map(callback);
		}
		return items;
	}
	
	/**
	 * Объединяет массив массивов в строку, по нескольким разделителям
	 * Элементы массива, соответствующего последнему разделителю, предварительно обрабатываются
	 * функцией callback
	 */
	function recursiveJoin(arr, levels, callback){
		let next = levels.slice(1), sep = levels[0], items;
		if(next.length){
			items = arr.map(a=>recursiveJoin(a, next, callback));
		}
		else if(callback){
			items = arr.map(callback);
		}
		else{
			items = arr;
		}
		let str = items.join(sep); 
		return str;
	}
	
	
module.exports = {
	recursiveSplit,
	recursiveJoin,
	splitWords,
	smallize,
	capitalize,
	optionalCapitalize,
	optionalLowerCamel
};