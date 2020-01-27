	var logo_up = "./img/tortuga_up.png";
	var logo_down = "./img/tortuga.png";
	var prompt = ">";
	var linea = "";
	var vieja_linea = "";
	var logo = new Image();
	var logo_m = {};
	logo.src = logo_up;
	logo.px = 0;
	logo.py = 0;
	logo.dx = 0;
	logo.dy = 0;
	logo.angulo = 90;
	logo.dangulo = 90;

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
	
	var colorLinea = "#000000"; // Line's color
	var colorFondo = "rgb(255, 255, 255)";

	var comandos = [{
		nom: "av",
		f: function(a) {
			var delta = new Number(a[0]) * stretch;
			if (isNaN(delta)) delta = 0 * stretch;
			var an = logo_m.angulo * Math.PI / 180;
			logo_m.dx = logo_m.px + Math.cos(an) * delta;
			logo_m.dy = logo_m.py - Math.sin(an) * delta;

			var obj = {
				x: logo_m.dx,
				y: logo_m.dy,
				a: logo_m.dangulo,
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
			var an = logo_m.angulo * Math.PI / 180;
			logo_m.dx = logo_m.px - Math.cos(an) * delta;
			logo_m.dy = logo_m.py + Math.sin(an) * delta;
			var obj = {
				x: logo_m.dx,
				y: logo_m.dy,
				a: logo_m.dangulo,
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
			logo_m.dangulo = logo_m.angulo - delta;

			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
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
			logo_m.dangulo = logo_m.angulo + delta;

			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a.slice(1);
		}
	}, {
		nom: "sp",
		f: function(a) {
			isDrawing = false;
			logo.src = logo_up;
			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "cp",
		f: function(a) {
			isDrawing = true;
			logo.src = logo_down;
			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
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

			logo_m.px = 0;
			logo_m.py = 0;
			logo_m.angulo = 90;

			logo_m.dx = 0;
			logo_m.dy = 0;
			logo_m.dangulo = 90;
			logo.src = logo_up;
			isDrawing = false;

			var obj = {
				x: logo_m.dx,
				y: logo_m.dy,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "pv",
		f: function(a) {
			logo_m.angulo = 90;
			var obj = {
				x: logo_m.dx,
				y: logo_m.dy,
				a: logo_m.angulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "tortuga",
		f: function(a) {
			isDrawing = false;
			logo_up = "./img/tortuga_up.png";
			logo_down = "./img/tortuga.png";
			logo.src = logo_up;
			moduloDelta = 0.5;
			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "spider",
		f: function(a) {
			isDrawing = false;
			logo_up = "./img/spider_up.png";
			logo_down = "./img/spider.png";
			logo.src = logo_up;
			moduloDelta = 0.7;
			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "cat",
		f: function(a) {
			isDrawing = false;
			logo_up = "./img/cat_up.png";
			logo_down = "./img/cat.png";
			logo.src = logo_up;
			moduloDelta = 0.9;
			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "trigono",
		f: function(a) {
			isDrawing = false;
			logo_up = "./img/trigono_up.png";
			logo_down = "./img/trigono.png";
			logo.src = logo_up;
			moduloDelta = 0.6;
			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "rocket",
		f: function(a) {
			isDrawing = false;
			logo_up = "./img/rocket_up.png";
			logo_down = "./img/rocket.png";
			logo.src = logo_up;
			moduloDelta = 0.9;
			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "bat",
		f: function(a) {
			isDrawing = false;
			logo_up = "./img/bat_up.png";
			logo_down = "./img/bat.png";
			logo.src = logo_up;
			moduloDelta = 0.4;
			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "cometa",
		f: function(a) {
			isDrawing = false;
			logo_up = "./img/cometa_up.png";
			logo_down = "./img/cometa.png";
			logo.src = logo_up;
			moduloDelta = 0.4;
			var obj = {
				x: logo_m.px,
				y: logo_m.py,
				a: logo_m.dangulo,
				t: isDrawing
			};
			figura.push(obj);

			return a;
		}
	}, {
		nom: "red",
		f: function(a) {
			colorLinea = "#FF0000";
			return a;
		}
	}, {
		nom: "green",
		f: function(a) {
			colorLinea = "#00FF00";
			return a;
		}
	}, {
		nom: "blue",
		f: function(a) {
			colorLinea = "#0000FF";
			return a;
		}
	}, {
		nom: "black",
		f: function(a) {
			colorLinea = "#000000";
			return a;
		}
	}, {
		nom: "white",
		f: function(a) {
			colorLinea = "#FFFFFF";
			return a;
		}
	}, {
		nom: "yellow",
		f: function(a) {
			colorLinea = "#FFFF00";
			return a;
		}
	}, {
		nom: "bred",
		f: function(a) {
			colorFondo = "rgb(255, 0, 0)";
			return a;
		}
	}, {
		nom: "bgreen",
		f: function(a) {
			colorFondo = "rgb(0, 255, 0)";
			return a;
		}
	}, {
		nom: "bblue",
		f: function(a) {
			colorFondo = "rgb(0, 0, 255)";
			return a;
		}
	}, {
		nom: "bblack",
		f: function(a) {
			colorFondo = "rgb(0, 0, 0)";
			return a;
		}
	}, {
		nom: "bwhite",
		f: function(a) {
			colorFondo = "rgb(255, 255, 255)";
			return a;
		}
	}, {
		nom: "byellow",
		f: function(a) {
			colorFondo = "rgb(255, 255, 0)";
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
		logo.px = x;
		logo.py = y;
		logo.angulo = ang;
	};

	function animarlogo() {
		if ((figura.length > 0) && (pasoFigura < figura.length)) {
			var p0 = figura[pasoFigura];

			logo.dx = p0.x;
			logo.dy = p0.y;
			logo.dangulo = p0.a;
			isDrawing = p0.t;

			intervaloAnim = setInterval(function() {
				var dx = logo.dx - logo.px;
				var dy = logo.dy - logo.py;
				var dang = logo.dangulo - logo.angulo;
				logo.pendiente = true;

				var eps = 0;

				var destX = logo.px;
				var destY = logo.py;
				var destAng = logo.angulo;

				if (dx * dx < EPSILON) {
					logo.px = logo.dx;
					eps++;
				} else {
					destX = logo.px + dx * moduloDelta;
				}

				if (dy * dy < EPSILON) {
					logo.py = logo.dy;
					eps++;
				} else {
					destY = logo.py + dy * moduloDelta;
				}

				if (dang * dang < EPSILON) {
					logo.angulo = logo.dangulo;
					eps++;
				} else {
					destAng = logo.angulo + dang * moduloDelta;
				}

				moverA(destX, destY, destAng);

				if (eps >= 3) {
					pasoFigura++;

					if (pasoFigura < figura.length) {
						logo.dx = figura[pasoFigura].x;
						logo.dy = figura[pasoFigura].y;
						logo.dangulo = figura[pasoFigura].a;
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
		comando = comando.trim(); // Limpia espacios de los extremos
		comando = comando.replace(/  +/g, ' '); // Limpia espacios inecesarios (deja uno)  /\s\s+/g
		var ops = comando.split(" ");
		if (findCountNeedlesHaystack("REPITE", ops) > 1) ops = ["LP"];
		var t = logo;
		if (pasoFigura < figura.length - 1) {
			t = figura[figura.length - 1];
			t.px = t.x;
			t.py = t.y;
			t.dx = t.x;
			t.dy = t.y;
			t.angulo = t.a;
			t.dangulo = t.a;
		}

		logo_m = {
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
					logo_m.px = logo_m.dx;
					logo_m.py = logo_m.dy;
					logo_m.angulo = logo_m.dangulo;

					ejecuto = true;
					break;
				}
			}

			if (!ejecuto) {
				break;
			}
		}

		animarlogo();
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
		var tw = logo.width / 2;
		var th = logo.height / 2;
		ctx.fillStyle = colorFondo;
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
				ctx.lineTo(cx + logo.px, cy + logo.py);
			} else {
				ctx.moveTo(cx + logo.px, cy + logo.py);
			}
		}

		ctx.strokeStyle = colorLinea;
		ctx.stroke();
		ctx.save();
		ctx.translate(cx + logo.px, cy + logo.py);
		ctx.rotate(-(logo.angulo - 90) * Math.PI / 180);
		ctx.drawImage(logo, -tw, -th);
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