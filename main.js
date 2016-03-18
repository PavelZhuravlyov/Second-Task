$(document).ready(function(){

	(function(){
		var mrgPopUp = $('.filter-popup').css('marginTop');

		$(document).on('click', '.btn-filter', function(){
			$('body').addClass('bodyShadow');
			$('.filter-popup').fadeIn(300);
			$('.filter-popup').css({
				'marginTop': -200
			});
			return false;
		});

		$(document).on('click', '.close-popup', function(){
			closePopUp(mrgPopUp);
			return false;
		});

		$(document).click(function (e){
			var div = $('.filter-popup');
			if (!div.is(e.target) && div.has(e.target).length === 0) {
				closePopUp(mrgPopUp);
			}
		});

		$(document).on('click', '.btn-clear-filter', function(){
			document.location.href = '/';
			return false;
		});
	})();

	(function(){
		$(document).on('click', '.f-pop-f-bl-subm', function(){
			var fromNumber = parseInt($(this).closest('form').find('input[name="from"]').val());
			var toNumber = $(this).closest('form').find('input[name="to"]').val();
			var reg = /[a-z][A-Z]/;
			console.log(fromNumber.search(reg));
			return false;
		});
	})();

	(function(){
		var list = ponyList.pony;
		var filter = parseUrl(decodeURI(document.location.search));
		
		(!filter) ? document.getElementById('id01').innerHTML = outPut(list, outRand(list.length-1)) : document.getElementById('id01').innerHTML =  printGoodsFilter(list, renderFilter(list, filter));
	})();

	function printGoodsFilter(list, arrNumbers){
		var stringGoods = '';
		if(arrNumbers.length == 0) stringGoods = "Извините, такого товара нет в наличии";
		else {
			for(var i=0; i<arrNumbers.length; i++){
				stringGoods += "<div class=\"item\"><p>Название: " + list[arrNumbers[i]].name + "</p><p>Цвет: " + list[arrNumbers[i]].color + "</p><p>Вид: " + list[arrNumbers[i]].kind + "</p><p>Цена: " + list[arrNumbers[i]].price + "</p><p>Новый товар: " + list[arrNumbers[i]].is_new + "</p></div>";
			}
		}
		return stringGoods;
	}

	function renderFilter(list, filter){
		var arrCountsOk = [],
			arrMainCounts = [],
			arrBuf = [];

		if(filter.color.length != 0){
			for(var i=0; i<list.length; i++){
				for(var z=0; z<filter.color.length; z++){
					if(list[i].color == filter.color[z]){
						arrCountsOk.push(i); // массив с индексами элементов, которые подходят по цвету
					} 
				}
			}

			arrBuf = arrCountsOk;
			arrMainCounts = arrBuf;
			arrCountsOk = [];
		}

		if(filter.kind.length != 0){
			for(var z=0; z<arrBuf.length; z++){
				for(var q=0; q<filter.kind.length; q++){
					if(list[arrBuf[z]].kind == filter.kind[q]){
						arrCountsOk.push(arrBuf[z]);
					}
				} 
			}

			arrBuf = arrCountsOk;
			arrMainCounts = arrBuf;
			arrCountsOk = [];
		}

		if(filter.is_new.length != 0){
			for(var z=0; z<arrBuf.length; z++){
				for(var q=0; q<filter.is_new.length; q++){
					if(String(list[arrBuf[z]].is_new) == filter.is_new[q]){
						arrCountsOk.push(arrBuf[z]);
					}
				} 
			}

			arrBuf = arrCountsOk;
			arrMainCounts = arrBuf;
			arrCountsOk = [];
		}

		if(filter.from[0] != '' && filter.to[0] != ''){
			var fromPrice = filter.from[0],
				toPrice = filter.to[0];

			for(var z=0; z<arrBuf.length; z++){
				if(list[arrBuf[z]].price > parseFloat(fromPrice) && list[arrBuf[z]].price < parseFloat(toPrice)) {
					arrCountsOk.push(arrBuf[z]);
				}
			}
		}

		return arrMainCounts;
	}

	function count_prs(obj){
	    var count = 0; 
	    for(var prs in obj) count++; 
	    return count; 
	}

	function parseUrl(url){
		if(url.indexOf('?') < 0) return false;

		url = url.split('?'); 
		url = url[1]; 

		return createHash(url);
	}

	function createHash(str){
		var obj = {
			'color': [],
			'from': [],
			'to': [],
			'kind': [],
			'is_new': []
		};

		var symbolPosition = 0;
		var substr = '';
		var property = '';
		var arr = [];
		var countSymb = countSymbols(str, '&');

		for(var i=0; i<countSymb; i++){
			symbolPosition = str.indexOf('&');
			substr = str.slice(0, symbolPosition);

			property = substr.slice(0, substr.indexOf('='));
			obj[property].push(substr.slice(substr.indexOf('=')+1, substr.length));

			str = str.replace(substr, '');
			if(i != (countSymb-1)) str = str.replace('&', '');
		}

		return obj;
	}

	function countSymbols(str, symbol){
		var count = 0;
		for(var i=0; i<str.length; i++) if(str[i] == symbol) count++;
		return count;
	}

	function findSymbol(str, symbol){
		return str.indexOf(symbol);
	}

	function sorting(a,b){
		return a - b;
	}

	function outPut(list, arrNumbers){ // Ещё как параметр массив со случ числами
		var stringGoods = "";
		arrNumbers = arrNumbers.sort(sorting);

		for(var i=0; i<arrNumbers.length; i++){
			stringGoods += "<div class=\"item\"><p>Название: " + list[arrNumbers[i]].name + "</p><p>Цвет: " + list[arrNumbers[i]].color + "</p><p>Вид: " + list[arrNumbers[i]].kind + "</p><p>Цена: " + list[arrNumbers[i]].price + "</p><p>Новый товар: " + list[arrNumbers[i]].is_new + "</p></div>";
		}

		return stringGoods;
	}

	function outRand(listCount){
		var arrNumbers = [],
			j = 0;

		while(j != 20){
			var genNumber = Math.floor((Math.random() * listCount) + 0);
			if(searchNumbInArr(genNumber, arrNumbers) != true) {
				arrNumbers.push(genNumber);
				j++;
			}
		}

		return arrNumbers;
	}

	function searchNumbInArr(numb, arr){
		var j = 0;

		for(var i=0; i<arr.length; i++){
			if(numb == arr[i]) {
				j++;
				break;
			}
		}

		if(j == 0) return false;
		else return true;
	}

	function closePopUp(mrgPopUp){
		$('body').removeClass('bodyShadow');
		$('.filter-popup').fadeOut(200);
		$('.filter-popup').css({
			'marginTop': mrgPopUp
		});
	}
});