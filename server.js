var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');

var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
	var camino='public'+objetourl.pathname;
	if (camino=='public/')
		camino='public/index.html';
	encaminar(pedido,respuesta,camino);
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});


function encaminar (pedido,respuesta,camino) {
	console.log(camino);
	switch (camino) {
		case 'public/recuperardatos': {
			recuperar(pedido,respuesta);
			break;
		}	
	    default : {  
			fs.exists(camino,function(existe){
				if (existe) {
					fs.readFile(camino,function(error,contenido){
						if (error) {
							respuesta.writeHead(500, {'Content-Type': 'text/plain'});
							respuesta.write('Error interno');
							respuesta.end();					
						} else {
							var vec = camino.split('.');
							var extension=vec[vec.length-1];
							var mimearchivo=mime[extension];
							respuesta.writeHead(200, {'Content-Type': mimearchivo});
							respuesta.write(contenido);
							respuesta.end();
						}
					});
				} else {
					respuesta.writeHead(404, {'Content-Type': 'text/html'});
					respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
					respuesta.end();
				}
			});	
		}
	}	
}


function recuperar(pedido,respuesta) {
    var info = '';
    pedido.on('data', function(datosparciales){
         info += datosparciales;
    });
    pedido.on('end', function(){
        var formulario = querystring.parse(info);
		respuesta.writeHead(200, {'Content-Type': 'text/html'});
		var resultado;
		var abecedario=['a', 'b', 'c', 'd', 'e','f', 'g', 'h', 'i', 'j','k', 'l', 'm', 'n', 'o','p', 'q', 'r', 's', 't','u', 'v', 'w', 'x', 'y', 'z'];
		var respU =formulario['hacer'];
		switch (respU)
			{
			 case "c":
			 	resultado = cifrar(formulario['num'], formulario['cad'], abecedario);
			 break;
			 case "d":	
				resultado = descifrar(formulario['num'], formulario['cad'], abecedario);
			 break;
			 default:
				resultado = "Un dato ingresado es invalido";
			}	
		var pagina=`<!doctype html><html><head>
		<head>
	<title>Piramide</title>
	<meta charset="UTF-8">
	 
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  </head>
		
		 <body style="background-color:#CECECE">
		 <div class="jumbotron text-center">
      		<h1>Codigo Cesar</h1>
		 </div><center>
		 <h3><br>Cadena cifrada:<br><br>
		 ${resultado}
		 </h3>
		 </center>
		 <br>
		 <center>
		 <br>
		 <br>
		 <br>
		 <br>
		  <a href="index.html"  class="btn btn-info">Volver</button></a>
		  </center>
	</body></html>`;
		respuesta.end(pagina);
    });	
}

function cifrar(num, cad, abc)
	{
	 var res = [""];
	 var longCad=parseInt(cad.length);
	 var longAbc=parseInt(abc.length);
	 var numC =parseInt(num);
	 for (var i=0 ; i<longCad ; i++)
		{
		 for (var j=0 ; j<longAbc ; j++)
			{
			 if (j+numC > longAbc && cad[i] == abc[j])
				{
				 var calc=parseInt(j + (numC - longAbc));
				 res += abc[calc];
				}
			 if (cad[i]==" ")
				{
				 res += " ";
				}
			 else if (cad[i] == abc[j])
				{
				 res += abc[j + numC];
				}
			}
		}
	 return res;
	}

function descifrar(num, cad, abc)
	{
	 var res = [""];
	 var longCad=parseInt(cad.length);
	 var longAbc=parseInt(abc.length);
	 var numC =parseInt(num);
	 for (var i=0 ; i<longCad ; i++)
		{
		 for (var j=0 ; j<longAbc ; j++)
			{
			 if (j-numC < 0 && cad[i] == abc[j])
				{
				 var calc=parseInt(j + (longAbc - numC));
				 res += abc[calc];
				}
			 if (cad[i]==" ")
				{
				 res += " ";   
				}
			 else if (cad[i] == abc[j])
				{
				 res += abc[j - numC];
				}
			}
		}
	 return res;
	}

console.log('Servidor web iniciado');