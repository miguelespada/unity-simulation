public var sync:boolean = false;
public var loop: boolean = false;
public var leaderLoop: boolean = false;

private var theLeader;
private var cars;
private var script: life;
public var loopStartTime: int = 0;
//bla bla
function Start () {
	cars  = GameObject.FindGameObjectsWithTag ("car");
	theLeader = GameObject.Find("controller").GetComponent("leader");
}

function LateUpdate () {
		
	if (Input.GetKeyDown ("l")) {
		if (Input.GetKey (KeyCode.RightShift) || Input.GetKey (KeyCode.LeftShift)){
			leaderLoop = !leaderLoop;
		}
		else{
			loop = true;
		}
	}
		
	if(Input.GetKeyUp ("s")) 
		sync = true;
	
	if (Input.GetKeyUp ("m")) {
		loopStartTime += 30;
		loop = true;
	}
	if(Input.GetKeyUp ("n")) {
		loopStartTime -= 30;
		if(loopStartTime < 0) loopStartTime = 0;
		loop = true;
	}
	
		
	if(leaderLoop){
		var dstTime = -1;
		script = theLeader.car.GetComponent("life") as life;
		dstTime = script.timeFromStart;
		for (var car:GameObject in cars){
			if(car.name != theLeader.car.name){
				script = car.GetComponent("life") as life;
				script.loop = true;
				script.loopStartTime = dstTime;
			}
		}
		leaderLoop = false;
	}
	
	if(loop){
		for (var car:GameObject in cars){
			script = car.GetComponent("life") as life;
			script.loop = true;
			script.loopStartTime = loopStartTime;
		}
		loop = false;
	}
	
	if(sync){
		for (var car:GameObject in cars){
			script = car.GetComponent("life") as life;
			script.sync = true;
		}
		sync = false;
	}
	

}