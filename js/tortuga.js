	var tortuga_up = "./img/tortuga_up.png";
	var tortuga_down = "./img/tortuga.png";
	var prompt = ">";
	var linea = "";
	var vieja_linea = "";
	var tortuga = new Image();
	var tortuga_m = {};
	tortuga.src = tortuga_up;
	tortuga.px = 0;
	tortuga.py = 0;
	tortuga.dx = 0;
	tortuga.dy = 0;
	tortuga.angulo = 90;
	tortuga.dangulo = 90;

	var historial = new Array();
	var historial_pos = -1;

	var cnv = document.getElementById('cnv');
	var ctx = cnv.getContext('2d');
	var consola = document.getElementById('consola');

	var moduloDelta = 0.5; // 0.7

	var isDrawing = false;

	var intervaloAnim = null;
	var intervaloRefresh = null;
	var EPSILON = 0.00001;

	var stretch = 4; //how many pixels is one turtle step
	var consoleLines = 3; //how many lines should be presented in the console

	var comandos = [{
		nom: "av",
		f: function(a) {
			var delta = new Number(a[0]) * stretch;
			if (isNaN(delta)) delta = 0 * stretch;
			var an = tortuga_m.angulo * Math.PI / 180;
			tortuga_m.dx = tortuga_m.px + Math.cos(an) * delta;
			tortuga_m.dy = tortuga_m.py - Math.sin(an) * delta;

			var obj = {
				x: tortuga_m.dx,
				y: tortuga_m.dy,
				a: tortuga_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a.slice(1);
		}
	}, {
		nom: "rt",
		f: function(a) {
			var delta = new Number(a[0]) * stretch;
			if (isNaN(delta)) delta = 0 * stretch;
			var an = tortuga_m.angulo * Math.PI / 180;
			tortuga_m.dx = tortuga_m.px - Math.cos(an) * delta;
			tortuga_m.dy = tortuga_m.py + Math.sin(an) * delta;
			var obj = {
				x: tortuga_m.dx,
				y: tortuga_m.dy,
				a: tortuga_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a.slice(1);
		}
	}, {
		nom: "gd",
		f: function(a) {
			var delta = new Number(a[0])*30;
			if (isNaN(delta)) delta = 0;
			tortuga_m.dangulo = tortuga_m.angulo - delta;

			var obj = {
				x: tortuga_m.px,
				y: tortuga_m.py,
				a: tortuga_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a.slice(1);
		}
	}, {
		nom: "gi",
		f: function(a) {
			var delta = new Number(a[0])*30;
			if (isNaN(delta)) delta = 0;
			tortuga_m.dangulo = tortuga_m.angulo + delta;

			var obj = {
				x: tortuga_m.px,
				y: tortuga_m.py,
				a: tortuga_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a.slice(1);
		}
	}, {
		nom: "sp",
		f: function(a) {
			isDrawing = false;
			tortuga.src = tortuga_up;
			var obj = {
				x: tortuga_m.px,
				y: tortuga_m.py,
				a: tortuga_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "cp",
		f: function(a) {
			isDrawing = true;
			tortuga.src = tortuga_down;
			var obj = {
				x: tortuga_m.px,
				y: tortuga_m.py,
				a: tortuga_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "repite",
		f: function(a) {
			var reps = new Number(a[0]);

			var b = a.slice(1);
			var c = new Array();

			for (var i = 0; i < reps; i++) {
				c = c.concat(b);
			}

			for (var i = 0; i < c.length; i++) {
				if ((c[i] == "repeat") && (c.length > i + 1)) {
					c[i + 1] = "" + (new Number(c[i + 1]) - 1);
				}
			}

			return c;
		}
	}, {
		nom: "lp",
		f: function(a) {
			pasoFigura = 0;
			figura = new Array();

			tortuga_m.px = 0;
			tortuga_m.py = 0;
			tortuga_m.angulo = 90;

			tortuga_m.dx = 0;
			tortuga_m.dy = 0;
			tortuga_m.dangulo = 90;
			tortuga.src = tortuga_up;
			isDrawing = false;

			var obj = {
				x: tortuga_m.dx,
				y: tortuga_m.dy,
				a: tortuga_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "pv",
		f: function(a) {
			tortuga_m.angulo = 90;
			var obj = {
				x: tortuga_m.dx,
				y: tortuga_m.dy,
				a: tortuga_m.angulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}];

	var figura = new Array();
	var pasoFigura = 0;

	cnv.left = 0;
	cnv.top = 0;
	cnv.width = window.innerWidth;
	cnv.height = window.innerHeight;

	window.addEventListener("resize", function() {
		cnv.width = window.innerWidth;
		cnv.height = window.innerHeight;
	}, true);

	function actualizarConsola() {
		var consoleText = "";
		var sep = "";
		var first = historial.length - consoleLines + 1;
		if (first < 0) first = 0;

		for (i = first; i < historial.length; i++) {
			consoleText += sep + historial[i];
			sep = "<br>";
		}

		var maxLineLength = window.innerWidth / 25 - 1;
		consoleText += sep + prompt + linea.slice(Math.max(0, linea.length - maxLineLength));
		consola.innerHTML = consoleText;
	};

	function moverA(x, y, ang) {
		tortuga.px = x;
		tortuga.py = y;
		tortuga.angulo = ang;
	};

	function animarTortuga() {
		if ((figura.length > 0) && (pasoFigura < figura.length)) {
			var p0 = figura[pasoFigura];

			tortuga.dx = p0.x;
			tortuga.dy = p0.y;
			tortuga.dangulo = p0.a;
			isDrawing = p0.t;

			intervaloAnim = setInterval(function() {
				var dx = tortuga.dx - tortuga.px;
				var dy = tortuga.dy - tortuga.py;
				var dang = tortuga.dangulo - tortuga.angulo;
				tortuga.pendiente = true;

				var eps = 0;

				var destX = tortuga.px;
				var destY = tortuga.py;
				var destAng = tortuga.angulo;

				if (dx * dx < EPSILON) {
					tortuga.px = tortuga.dx;
					eps++;
				} else {
					destX = tortuga.px + dx * moduloDelta;
				}

				if (dy * dy < EPSILON) {
					tortuga.py = tortuga.dy;
					eps++;
				} else {
					destY = tortuga.py + dy * moduloDelta;
				}

				if (dang * dang < EPSILON) {
					tortuga.angulo = tortuga.dangulo;
					eps++;
				} else {
					destAng = tortuga.angulo + dang * moduloDelta;
				}

				moverA(destX, destY, destAng);

				if (eps >= 3) {
					pasoFigura++;

					if (pasoFigura < figura.length) {
						tortuga.dx = figura[pasoFigura].x;
						tortuga.dy = figura[pasoFigura].y;
						tortuga.dangulo = figura[pasoFigura].a;
						isDrawing = figura[pasoFigura].t;
					} else {
						clearInterval(intervaloAnim);
					}
				}
			}, 35);
		}
	};
	
	function findCountNeedlesHaystack(aguja, Haystack) {
		var cont = 0;
		while (Haystack.length > 0) {
			if (Haystack[0] == aguja){
				cont = cont + 1;
			}
			Haystack = Haystack.slice(1);
		}
		return cont;
	}
	
	function ejecutar(comando) {
		comando = comando.trim();
		var ops = comando.split(" ");
		if (findCountNeedlesHaystack("REPITE", ops) > 1) ops = ["LP"];
		var t = tortuga;
		if (pasoFigura < figura.length - 1) {
			t = figura[figura.length - 1];
			t.px = t.x;
			t.py = t.y;
			t.dx = t.x;
			t.dy = t.y;
			t.angulo = t.a;
			t.dangulo = t.a;
		}

		tortuga_m = {
			px: t.px,
			py: t.py,
			dx: t.dx,
			dy: t.dy,
			angulo: t.angulo,
			dangulo: t.dangulo
		};

		while (ops.length > 0) {
			var ejecuto = false;
			for (var i = 0; i < comandos.length; i++) {
				var cmd = comandos[i];

				if (cmd.nom.slice(0, ops[0].length).toLowerCase() == ops[0].toLowerCase()) {
					ops = cmd.f(ops.slice(1));
					tortuga_m.px = tortuga_m.dx;
					tortuga_m.py = tortuga_m.dy;
					tortuga_m.angulo = tortuga_m.dangulo;

					ejecuto = true;
					break;
				}
			}

			if (!ejecuto) {
				break;
			}
		}

		animarTortuga();
	}

	function completarComando(comando) {
		var ops = comando.split(" ");

		if (ops.length > 0) {
			var com = ops[ops.length - 1];
			for (var i = 0; i < comandos.length; i++) {
				var cmd = comandos[i];

				if (cmd.nom.slice(0, com.length).toLowerCase() == com.toLowerCase()) {
					return (ops.slice(0, ops.length - 1).join(" ") + " " + cmd.nom).trim() + " ";
				}
			}
		}

		return comando;
	}

	document.onkeydown = function(ev) {
		if (ev.keyCode == 8) { // Erase
			if (linea.length > 0) {
				linea = linea.slice(0, linea.length - 1);
				actualizarConsola();
			}
			return false;
		} else if (ev.keyCode == 13) { // Enter
			if (linea.length > 0) {
				ejecutar(linea);
				historial.push(linea);
				historial_pos = historial.length;
				linea = "";
				actualizarConsola();
			}
		} else if (ev.keyCode == 38) { // Cursor up
			if (historial_pos == historial.length) {
				vieja_linea = linea;
			}

			historial_pos--;
			if (historial_pos < 0) {
				historial_pos = 0;
			}
			linea = historial[historial_pos];
			actualizarConsola();
		} else if (ev.keyCode == 40) { // Cursor down
			historial_pos++;
			if (historial_pos < historial.length) {
				linea = historial[historial_pos];
			} else if (historial_pos == historial.length) {
				linea = vieja_linea;
				vieja_linea = "";
			} else if (historial_pos > historial.length) {
				historial_pos = historial.length;
			}

			actualizarConsola();
		} else if (ev.keyCode == 37) { // Cursor left
		} else if (ev.keyCode == 39) { // Cursor right
		} else if (ev.keyCode == 9) { // Tab
			linea = completarComando(linea).toUpperCase();
			actualizarConsola();

			return false;
		}
	};

	document.addEventListener("kerydown", document.onkeydown, true);

	document.onkeypress = function(ev) {
		var ch = String.fromCharCode(ev.charCode);
		if (((ch.trim().length > 0) || (ch == " ")) && (ev.charCode != 0)) {
			linea += ch.toUpperCase();
			actualizarConsola();
		}
	};

	intervaloRefresh = setInterval(function() {
		var cx = cnv.width / 2;
		var cy = (cnv.height - 130) / 2;
		var tw = tortuga.width / 2;
		var th = tortuga.height / 2;
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(0, 0, cnv.width, cnv.height);

		ctx.fillStyle = "black";

		ctx.lineWidth = 4; // line width
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.moveTo(cx, cy);

		var u = Math.min(figura.length - 1, pasoFigura);

		for (var i = 0; i < u; i++) {
			var obj = figura[i];
			if (obj.t) {
				ctx.lineTo(obj.x + cx, cy + obj.y);
			} else {
				ctx.moveTo(obj.x + cx, cy + obj.y);
			}
		}

		if (u < figura.length) {
			if (isDrawing) {
				ctx.lineTo(cx + tortuga.px, cy + tortuga.py);
			} else {
				ctx.moveTo(cx + tortuga.px, cy + tortuga.py);
			}
		}

		ctx.stroke();
		ctx.save();
		ctx.translate(cx + tortuga.px, cy + tortuga.py);
		ctx.rotate(-(tortuga.angulo - 90) * Math.PI / 180);
		ctx.drawImage(tortuga, -tw, -th);
		ctx.restore();
	}, 15);

	function showInfo() {
		var elem = document.getElementById("info");
		elem.style.display = "block";
	};

	function hideInfo() {
		var elem = document.getElementById("info");
		elem.style.display = "none";
	};

	actualizarConsola();