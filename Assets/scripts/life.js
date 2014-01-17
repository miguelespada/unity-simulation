import System.IO;
var cue = Array();
public var cueLength: int; 
var pos: int = 1;
public var pIndex: int;
	
public var buffer: int = 10;
public var destination:Vector3;
var speed: float = 0.1;
var remainingDst: int = 0;
var timeFromStart: int = 0;
public var status:String;

private var teorico: loadTrack;
var smoothRotation:float = 10;

public var sync:boolean = true;
public var loop: boolean = false;
public var loopStartTime: int;

private var lastChecked: int = 0;

 public var updating: boolean = false; 
 
function Start () {
	teorico = GameObject.Find("teorico").GetComponent("loadTrack") as loadTrack;
	while(!teorico.ready)
		yield WaitForSeconds (1);
	status = "start";
	sync = true;
}


function synchronize(){ 
	sync = false;
	yield loadTrack(0);
	
	if(cue.length >= 1){    
		pos = cue.length - buffer;
		if(pos < 1) pos = 1;  
		if(status == "start") {
			pos  = 0;
		}
		setValues(cue[pos]);	
		transform.position = destination;  
	}  
	else
		sync = true;
	
	
}

function startLoop(loopStartTime){ 
	yield loadTrack(0);
	loop = false;
 
	if(cue.length > 0){
		pos = getLoopPosByTime(loopStartTime);
		setValues(cue[pos]);
		transform.position = destination;
		if(pos == 0){
			speed = 0;
			status = "out";
		}
	 }
}

function setValues(cuePos){
	pIndex = cuePos[0];
	destination = teorico.vertices[pIndex];
	speed = cuePos[1];
	remainingDst = cuePos[2];
	timeFromStart = cuePos[3];
	status = cuePos[4];
	if(status == "ended") speed = 0;
		
}


function updatePos(){
	
	if(pos < cue.length - 1){	
		pos += 1;
		setValues(cue[pos]);
	}
	else{ 
		 if(status == "out") return; 
		 yield loadTrack(pIndex);	
	 }
}



function Update () {
	
	if(sync) synchronize();	  
	if(loop) startLoop(loopStartTime);
	 
	move();
	
}


function move(){
	var step = speed * Time.deltaTime;
	transform.position = Vector3.MoveTowards(transform.position, destination, step);
	if(transform.position == destination) updatePos();
	var targetDir = destination - transform.position;	
	if(destination - transform.position != Vector3.zero){
			var rotation = Quaternion.LookRotation(destination - transform.position);
			transform.rotation = Quaternion.Slerp(transform.rotation, 
								rotation, Time.deltaTime * smoothRotation);	
	}
}



function loadTrack(index){  
	if(lastChecked + 2 > Time.time ) return;  
	updating = true;
	lastChecked = Time.time;
 	
	var hostName = teorico.hostName;
	var tramoId = teorico.tramo;
   	if(index == 0)
   		cue = new Array();
   	
	var query = hostName + "php/select.php?car="+ gameObject.name +"&tramo=" + (parseInt(tramoId) - 1) + "&pos=" + index;
	var hs_get = WWW(query);
 	yield hs_get; 
 	if(hs_get.error) 
    	print("There was an error loading... " + query);
	 
    var fileContents = hs_get.text;
 	var lines = fileContents.Split("\n"[0]); 
 	
 	if(lines.length <= 1) 
 		return; 
   		 
   		 
    for (line in lines) {
    	
    	if(line == "") break;
    	var tokens = line.Split(","[0]);
		var pV: Array = new Array();
		
		pV[0] = parseInt(tokens[0]); // index
		pV[1] = parseFloat(tokens[1]); // speed
		pV[2] = parseInt(tokens[2]); // distance to end
		pV[3] = parseFloat(tokens[3]); // time
		pV[4] = tokens[4];
    	cue.push(pV);
    }
    cueLength = cue.length;
       
	updating =false;
}



function getLoopPosByTime(t){
	if(cue.length == 0) return 0;
	if(t == 0) return 1;
	for(var n = 0; n < cue.length; n++)
		if( cue[n][3] >= t) return n;
	return 0;
}