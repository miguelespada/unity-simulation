import System.IO;
var cue = Array();
public var cueLength: int; 
var pos: int = 1;
public var pIndex: int;
	
public var destination:Vector3;
var speed: float = 0.1;
var remainingDst: float = 0;
var timeFromStart: float = 0;
public var status:String;

private var teorico: loadTrack;
private var controller: controller;

public var sync:boolean = true;
public var loop: boolean = false;
public var loopStartTime: int;

private var lastChecked: int = 0;
public var carRotation;
 
 
public var isEnabled: boolean = true;
private var allMyRenderers: Array;
public var carName: String = "";
 
public var isFinished: boolean; 
private var isLoading: boolean = false;

function Start () {

	allMyRenderers = GetComponentsInChildren(Renderer);
	teorico = GameObject.Find("teorico").GetComponent("loadTrack") as loadTrack;
	controller = GameObject.Find("controller").GetComponent("controller") as controller;
	while(!teorico.ready){
		yield WaitForSeconds (1);
	} 
	
	status = "start";
	sync = false;
	isEnabled = false;
	isFinished = false;
	
	loadCarName();
	cue = new Array();
	
}


function synchronize(){ 
	sync = false;
	isEnabled = true;
	
	if(!isFinished){
		appendTracks();
	}
	else{
		status = "ended";
	}
	
	if(cue.length == 0){ 
		yield WaitForSeconds(2); 
		sync = true;
		return;
	}
	 
	 
	if(status == "ended") {
		pos = cue.length - 1;
		speed = 0;
		return;
	}
	if(status == "start") pos  = 0;
	else if(cue.length < controller.buffer) pos = 1;  
	else pos = cue.length - controller.buffer;
	
	setValues(cue[pos], true);	
	transform.position = destination;  
}


function startLoop(loopStartTime){ 
	
	loop = false;
	isEnabled = true;
	
	appendTracks();
	
	if(cueLength > 0){
		pos = getLoopPosByTime(loopStartTime);
		setValues(cue[pos], true);
		transform.position = destination;
		if(pos == 0){
			speed = 0;
			status = "out";
		}
	 }
}

function setValues(cuePos, reset){
	pIndex = cuePos[0];
	destination = teorico.vertices[pIndex];
	
	if(cuePos[1] > 40 ) cuePos[1] = 40;
	if(cuePos[1] < 0 ) cuePos[1] = 10;
	
	speed = Mathf.Lerp(speed, cuePos[1], Time.deltaTime * 6);
	
	if(reset){
		remainingDst = cuePos[2];
		timeFromStart = cuePos[3]; 
	}
	status = cuePos[4];
		
}


function updatePos(){
	if(pos < cue.length - 1){	
		pos += 1;
		setValues(cue[pos], false); 
	}
}



function Update () {
	
	move();
	
	if(sync) 
		synchronize();	  
	
	if(loop) 
		startLoop(loopStartTime);
	
	
	if(!isFinished && (lastChecked + 3  < Time.time)){ 
		lastChecked = Time.time;  
		appendTracks();
	} 
	
	if(status == "start"||  status == "ended" || status == "out") isEnabled = false;
	activeChildren(isEnabled);
}


function appendTracks(){ 
	if(isFinished) return;
	if(controller.state != 0 && status == "out" ) return;
	if(controller.state != 0 && status == "start" ) return;
	if(cue.length == 0) {
		loadTrack(0);
	}
	else{
		cuePos = cue[cue.length - 1];
		loadTrack(cuePos[0]);
	}
}


function loadTrack(index){   
	if(isLoading) return;
	isLoading = true;
//	print(gameObject.name + " loading track from index " + index);
	
	var hostName = teorico.hostName;
	var tramoId = teorico.tramo;
	var query = hostName + "php/select.php?car="+ gameObject.name +"&tramo=" + tramoId + "&pos=" + index;
	var hs_get = WWW(query);
 	yield hs_get; 

 	if(hs_get.error) {
    	print("There was an error loading... " + query);
    	return;
    }
	 
    var fileContents = hs_get.text;
 	var lines = fileContents.Split("\n"[0]); 
   	
    for (line in lines) {
    	if(line == "") break;
    	var tokens = line.Split(","[0]);
		var pV: Array = new Array();
		pV[0] = parseInt(tokens[0]); // index
		pV[1] = parseFloat(tokens[1]); // speed
		pV[2] = parseInt(tokens[2]); // distance to end
		pV[3] = parseFloat(tokens[3]); // time
		pV[4] = tokens[4];//status
    	status = pV[4];
    	cue.push(pV);
    }
    
    if(status == "ended") isFinished = true;
    cueLength = cue.length;
    isLoading = false;
}

function getLoopPosByTime(t){
	if(t == 0) return 1;
	for(var n = 0; n < cue.length; n++)
		if( cue[n][3] >= t) return n;
	return 0;
}

function activeChildren(b){
    for (var renderer : Renderer in allMyRenderers) 
       renderer.enabled = b ;
}
function loadCarName(){
	var hostName = teorico.hostName;
	var query = hostName + "php/carName.php?id="+ gameObject.name;
	var hs_get = WWW(query);
 	yield hs_get; 
 	
 	if(hs_get.error) 
    	print("There was an error loading... " + query);
	
    var fileContents = hs_get.text;
 	var lines = fileContents.Split("\n"[0]); 
  	carName =  lines[0];
 	
}


function move(){
	var step = speed * Time.deltaTime; 
	var prev: Vector3 =  transform.position;
	transform.position = Vector3.MoveTowards(transform.position, destination, step); 
	
	remainingDst -= (Vector3.Distance(prev, transform.position)); 
	timeFromStart += Time.deltaTime; 
	
	if(transform.position == destination) updatePos();
	var targetDir = destination - transform.position;	
	if(destination - transform.position != Vector3.zero)
		carRotation = Quaternion.LookRotation(destination - transform.position);
}
