window.onload = function() {
	var app, deleteData;

	app = function(e) {
		var data, rawData, methods, createTable, createTableInfo, createTableAnalyze, createDataAnalysis;

		e.preventDefault();
		data = [];
		rawData = document.getElementById('formData').dataList.options;

		for (var i=0;i<rawData.length;i++) {
			data.push(rawData[i]);
		}

		methods = (function() {
			var dataList, N, sumXi, indexAnlData, rawNumberData, outputFormat;

			dataList = [];
			sumXi = 0;
			rawNumberData = data.map(function(i) {
				return i.value; 
			});
			outputFormat = function(num) {
				return Number(num.toFixed(2));
			};


			while (rawNumberData.length) {
				indexAnlData = -1;

				for (var x=0;x<dataList.length;x++) {
					if (rawNumberData[0] == dataList[x].value) {
						indexAnlData = x;
						break;
					}
				}

				if (indexAnlData === -1) {
					dataList.push({
						value:Number(rawNumberData[0]),
						freq:1
					});
					rawNumberData.splice(0, 1);
				} else {
					dataList[indexAnlData].freq++;
					rawNumberData.splice(0, 1);
				}
			}


			N = (function() {
				var n = 0;
				for (var i=0;i<dataList.length;i++) {
					n += dataList[i].freq;
				}
				return n;
			})();

			for (var i=0;i<dataList.length;i++) {
				sumXi += dataList[i].value*dataList[i].freq;
			}

			return {
				getData:function() {
					return dataList;
				},
				getDataNumber:function() {
					return N;
				},
				calcXBar:function() {
					return outputFormat(sumXi / N);
				},
				calcDesvXi:function(Xi) {
					return outputFormat(Xi - this.calcXBar());
				},
				calcRange:function() {
					var filterArr = dataList.map((i)=>{return i.value});
					return outputFormat(max(dataList.map((i)=>{return i.value})) - min(dataList.map((i)=>{return i.value})));
				},
				calcDeltXPow:function(power, abs) {
					var Xis = [];
					var XBar = this.calcXBar();

					for (var i=0;i<dataList.length;i++) {
						if (abs)
							Xis.push(Math.pow(Math.abs(dataList[i].value-XBar), power)*dataList[i].freq);
						else 
							Xis.push(Math.pow(dataList[i].value-XBar, power)*dataList[i].freq);
					};

					return outputFormat(Xis.reduce((a,b)=>{return a+b;}));
				},
				calcDesvStnd:function() {
					return outputFormat(this.calcDeltXPow(1, true) / N);
				},
				calcVariance:function() {
					return outputFormat(this.calcDeltXPow(2)/N);
				},
				calcStndErr:function() {
					return outputFormat(Math.sqrt(this.calcVariance()));
				},
				calcPearson:function() {
					return outputFormat(this.calcStndErr() / this.calcXBar());
				},
				calcFisher:function() {
					return outputFormat((this.calcDeltXPow(3)/N)/Math.pow(this.calcStndErr(), 3));
				},
				calcCurtosis:function() {
					return outputFormat(((this.calcDeltXPow(4)/N)/Math.pow(this.calcStndErr(),4))-3);
				}

			}
		})();

		createTableInfo = function() {
			var openTag, theader, tbody, closeTag, dataList;

			dataList = methods.getData().map((i)=>{return i.value;});
			openTag = '<table class="table">';
			theader = '<theader><tr><th>Número de datos</th><th>Rango</th><th>Menor dato</th><th>Mayor dato</th></tr></theader>';
			tbody = '<tbody><tr><td>' + methods.getDataNumber() + '</td><td>' + methods.calcRange() + '</td><td>' + min(dataList) + '</td><td>' + max(dataList) + '</td></tr></tbody>';
			closeTag = '</table>';

			return openTag+theader+tbody+closeTag;
		};

		createTable = function() {
			var openTag, header, body, closeTag, freqRelative, freqRelativePercent, deltX, absDeltX, deltXtwo, deltXthree, deltXfour, dataList, N;

			openTag = '<table class="table table-striped">';
			header = '<theader><tr><th>Xi</th><th>F</th><th>Fr</th><th>Fr%</th><th>Xi-Xbar</th><th>|Xi-Xbar|</th><th>(Xi-Xbar)ᶺ2Fi</th><th>(Xi-Xbar)ᶺ3Fi</th><th>(Xi-Xbar)ᶺ4Fi</th></tr></thead>';
			body = '<tbody>';
			closeTag = '</table>';
			dataList = methods.getData();
			N = methods.getDataNumber();


			for (var i=0;i<dataList.length;i++) {
				freqRelative = (dataList[i].freq/N).toFixed(2);
				freqRelativePercent = (freqRelative*100).toFixed(2);
				deltX = (dataList[i].value - methods.calcXBar()).toFixed(2);
				absDeltX = (Math.abs(deltX)).toFixed(2);
				deltXtwo = (Math.pow(deltX, 2)*dataList[i].freq).toFixed(2);
				deltXthree = (Math.pow(deltX, 3)*dataList[i].freq).toFixed(2);
				deltXfour = (Math.pow(deltX, 4)*dataList[i].freq).toFixed(2);

				body += '<tr>';
				body += '<td>' + dataList[i].value + '</td>';
				body += '<td>' + dataList[i].freq + '</td>';
				body += '<td>' + freqRelative + '</td>';
				body += '<td>' + freqRelativePercent + '</td>';
				body += '<td>' + deltX + '</td>';
				body += '<td>' + absDeltX + '</td>';
				body += '<td>' + deltXtwo + '</td>';
				body += '<td>' + deltXthree + '</td>';
				body += '<td>' + deltXfour + '</td>';
			}

			body += '</tbody>';

			return openTag+header+body+closeTag;

		};

		createTableAnalyze = function() {
			var openTag, theader, tbody, closeTag, Xbar, deltX, variance, sigma, pearson, fisher, curtosis;

			Xbar = methods.calcXBar();
			deltX = methods.calcDesvStnd();
			variance = methods.calcVariance();
			sigma = methods.calcStndErr();
			pearson = methods.calcPearson();
			fisher = methods.calcFisher();
			curtosis = methods.calcCurtosis();

			openTag = '<table class="table">';
			theader = '<theader><tr><th>Promedio (Xbar)</th><th>Error medio</th><th>Varianza</th><th>Desviación Estándar</th><th>Pearson</th><th>Fisher</th><th>Curtosis</th></tr></theader>';
			tbody = '<tbody><tr><td>' + Xbar + '</td><td>' + deltX + '</td><td>' + variance + '</td><td>' + sigma + '</td><td>' + pearson + '</td><td>' + fisher + '</td><td>' + curtosis + '</td></tr></tbody>';
			closeTag = '</table>';

			return openTag+theader+tbody+closeTag;
		};

		createDataAnalysis = function() {
			var title, promedio, errorMedio, curvaDatos, fisher, curtosis;

			fisher = (function() {
				if (-0.1 < methods.calcFisher() && methods.calcFisher() < 0.1) {
					return 'simétrica';
				} else if (methods.calcFisher() < 0.1) {
					return 'asimétrica positiva';
				} else {
					return 'asimétrica negativa';
				}
			})();

			curtosis = (function() {
				if (methods.calcCurtosis() < 0.1) {
					return 'mesocúrtica';
				} else if (methods.calcCurtosis() > 0.1) {
					return 'platicúrtica';
				} else {
					return 'leptocúrtica';
				}
			})();

			title = '<h2>Análisis de resultados</h2>';
			promedio = '<p>El dato del conjunto con mayor probabilidad de aparición es ' + methods.calcXBar() + '. Según el coeficiente de Pearson, este promedio ' + ((methods.calcPearson() < 0.20)? '':'no') + ' es representante de la totalidad de los datos.</p>';
			errorMedio = '<p>La diferencia promedio entre cada medida con el valor que equilibra el sistema, es decir, diferencia con respecto al promedio es de ' + methods.calcDesvStnd() + '.</p>';
			curvaDatos = '<p>La curva que crea el conjunto de datos es, según el coeficiente de Fisher, ' + fisher + ' con respecto al valor promedio del sistema. Según el coeficiente de Curtosis, la curva tiene una forma ' + curtosis + '.</p>'

			return title+promedio+errorMedio+curvaDatos;
		}

		document.getElementsByClassName('table-container')[0].innerHTML = createTable();
		document.getElementsByClassName('table-info')[0].innerHTML = createTableInfo();
		document.getElementsByClassName('table-analyze')[0].innerHTML = createTableAnalyze();
		document.getElementsByClassName('table-data-analyze')[0].innerHTML = createDataAnalysis();
		document.getElementsByClassName('home-container')[0].style = 'display:none';

	};

	deleteData = function(e) {
		var opts;

		opts = document.getElementsByTagName('option');

		for (var i=0;i<opts.length;i++) {
			if (opts[i].selected) {
				opts[i].remove();
			}
		}
	};

	document.getElementById('formData').addEventListener('submit', app);
	document.getElementById('formDataInput').addEventListener('submit', function(e) {
		var inputBox = e.target.dataInput;
		var input = inputBox.value;
		var dataPoll = document.getElementById('formData').dataList.innerHTML;
		e.preventDefault();

		document.getElementById('formData').dataList.innerHTML += '<option value="' + input + '" >' + input + '</option>';
		inputBox.value = '';
		inputBox.focus();
	});
	document.getElementById('delete-data').addEventListener('click', deleteData);

};