
private var teorico: loadTrack;
public var pos: int = 0;
private var pPos: int = 0;
public var distance: float  = 0;
var cars = Array();
private var lastPeriod: int = 0;
public var checkIn: Array;
public var tiempos: float[];
public var clasificacion: String[];
public var n : int;
private var theLeader;

function Start(){
	cars  = GameObject.FindGameObjectsWithTag ("car");
	tiempos = new float[cars.length];
	clasificacion = new String[cars.length];
	n = 0;
	
	theLeader = GameObject.Find("controller").GetComponent("leader");
}

function Update () {
	if(Input.GetKeyUp ("v")) {
		
		if(theLeader){
			var script = theLeader.car.GetComponent("life") as life;
			pos = script.pIndex + 40;
		}
	}
		
	if(!teorico){
		teorico = GameObject.Find("teorico").GetComponent("loadTrack") as loadTrack;
		
	}
	else{
		if(pPos != pos) updateBaliza();
	}
	
	if( Time.time < lastPeriod + 1) return;
	lastPeriod = Time.time;
	updateCars();
}

function updateBaliza(){
	reset();
	if(teorico.vertices.length == 0) return;
	if(pos <0 ) pos = 0;
	if(pos >= teorico.vertices.length - 1) pos = teorico.vertices.length - 2;
	transform.position = teorico.vertices[pos];
	transform.LookAt(teorico.vertices[pos + 1]);
	
	pPos = pos;
	
	var hostName = teorico.hostName;
	var query = hostName + "php/distance.php?tramoId=" + teorico.tramo + "&pos="+ pos;
	var hs_get = WWW(query);
 	yield hs_get; 
 	
 	if(hs_get.error) 
    	print("There was an error loading... " + query);
	
    var fileContents = hs_get.text;
 	var lines = fileContents.Split("\n"[0]); 
 	try{
 		distance =  parseFloat(lines[0]);
 	}
 	catch(Exception ){
 	}
 	gameObject.name = "baliza_" + (distance/1000).ToString("F1") + "_km";
}

function updateCars(){
	reset();
	for(var car in cars){
		if(!car.active) continue;
		var script = car.GetComponent("life") as life;
		if(!script) continue;
		if(!script.isEnabled) continue;
		if(script.pIndex >= pos){
			checkIn.push(car.name);
		}
	}
	if(checkIn.length > 0)
		updateTime();
}

function updateTime(){
	var hostName = teorico.hostName;
	var query = hostName + "php/baliza.php?tramoId=" + teorico.tramo + "&pos="+ pos;
	var hs_get = WWW(query);
 	while(!hs_get.isDone){
 		yield WaitForSeconds(0.1);
 	}; 
 	
 	if(hs_get.error) 
    	print("There was an error loading... " + query);
	
    var fileContents = hs_get.text;
 	var lines = fileContents.Split(","[0]); 
 	n = 0;
 	for(line in lines){
 		if(line == "") break;
 		var tokens = line.Split(" "[0]);
 		var id = tokens[0];
 		var time = parseFloat(tokens[1]);
 		for(var c in checkIn){
 			if(c == id){
 				clasificacion[n] = id;
 				tiempos[n] = time;
 				n += 1;
 				break;
 			}
 		}
 	}
}

function reset(){
	checkIn = new Array();	
	n = 0;
}