import System.IO;
var fileName : String;
var cue = Array();
	
var destination:Vector3;
var speed: float = 0.1;
var pos: int = 1;
var smoothRotation:float = 10;
var dstFromStart: int = 0;

public var teorico: loadTrack;
private var ready;

function loadLoop(){
	ready = false;
	var hostName = teorico.hostName;
	var hs_get = WWW(hostName + "Loops/Tramo_0_car_" + gameObject.name + "_interpolated.csv");
 	yield hs_get; 
 	if(hs_get.error) {
    	print("There was an error");
	 }
	 
    var fileContents = hs_get.text;
 	var lines = fileContents.Split("\n"[0]);
	    
    var n = 0;
    for (line in lines) {
    	if(n == 0){
    		n += 1;
    	}
    	else if(line.Length > 20){
    		var tokens = line.Split(","[0]);
			var pV: Vector3 = Vector3(parseInt(tokens[3]), 
									parseFloat(tokens[5]), 
									parseFloat(tokens[11]));
    		cue.push(pV);
    	}
    }
    ready = true;
}

function Start () {
	teorico = GameObject.Find("teorico").GetComponent("loadTrack") as loadTrack;
	while(!teorico.ready){
		yield WaitForSeconds (1);
	}
	
	loadLoop();
	while(!ready){
		yield WaitForSeconds (1);
	}
	
	pos = 0;
	updatePos();
	transform.position = destination;
}

function updatePos(){
	if(pos >= cue.length){	
		speed = 0;
		dstFromStart = 0;
	}
	else{
		var cuePos:Vector3 = cue[pos];
		destination = teorico.vertices[cuePos[0]];
		speed = cuePos[1];
		dstFromStart = cuePos[2];
	}
}


function move(){
	var step = speed * Time.deltaTime;
	transform.position = Vector3.MoveTowards(transform.position, destination, step);
	if(transform.position == destination){
		pos = (pos + 1);
		updatePos();
	}
	var targetDir = destination - transform.position;	
	if(destination - transform.position != Vector3.zero){
			var rotation = Quaternion.LookRotation(destination - transform.position);
			transform.rotation = Quaternion.Slerp(transform.rotation, 
								rotation, Time.deltaTime * smoothRotation);	
		}
}

function Update () {
	if(ready)
		move();
}

