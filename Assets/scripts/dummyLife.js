import System.IO;
var cue = Array();
public var cueLength: int; 
var pos: int = 1;
public var pIndex: int;
	
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
	
	pos = 0;
	destination =  teorico.vertices[pos];
	transform.position = destination;
	pos = 1;
	speed = 10;
	destination =  teorico.vertices[pos];

}


function updatePos(){
	pos += 1;
	destination =  teorico.vertices[pos];
}



function Update () {

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


