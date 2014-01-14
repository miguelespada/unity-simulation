#pragma strict

var hostName: String = "http://localhost:8888/unity/";
public var prueba: String;
public var tramo: String;
var lineRenderer: LineRenderer;
public var vertices = Array();
public var ready = false;

function Start () {
 var fileName = "Tramos/" + prueba + "/" + tramo + "/" + tramo + "_real" + ".txt";
 print(hostName + fileName);
 var hs_get = WWW(hostName + fileName);
 yield hs_get; 
 if(hs_get.error) {
    print("There was an error");
 }
    
 var fileContents = hs_get.text;
 var lines = fileContents.Split("\n"[0]);
 lineRenderer = GetComponent(LineRenderer);
 lineRenderer.SetVertexCount(lines.length - 1);
 var n = 0;
 var pV : Vector3;
 for (line in lines) {
 		var tokens = line.Split(" "[0]);
 		if(tokens.length != 3) 
 			continue;
 		pV = Vector3(-parseFloat(tokens[1]), parseFloat(tokens[2]), -parseFloat(tokens[0]));

		lineRenderer.SetPosition(n, pV);
		vertices.push(pV);
  		n += 1;
  }
  ready = true;
 
}
