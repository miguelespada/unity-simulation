var target : Transform;
var smooth = 6.0;
var theCamera;
private var theLeader;

function Start () {
	theCamera =  GameObject.Find("cameras").GetComponent("cameraController");
	while(!theLeader){
		theLeader = GameObject.Find("controller").GetComponent("leader");
		yield WaitForSeconds(1);
	}
}

function LateUpdate () {
	if(!Input.GetKey ("c")){
		if (Input.GetKey ("e")){
			transform.localScale *= 1.1;
		}
		if (Input.GetKey ("d")){
			transform.localScale *= 0.9;
		}
	}
	if(theCamera.theCamera.name == "cameraCar" || theCamera.theCamera.name == "cameraTop"){
			transform.rotation = Quaternion.LookRotation(Vector3.up);	
			return;
	}
	if(theLeader.car.name == transform.parent.name){
		target = theCamera.theCamera.transform;
		var rotation = Quaternion.LookRotation(target.position - transform.position);
		transform.rotation = Quaternion.Slerp(transform.rotation, rotation, Time.deltaTime * smooth);		
	
	}
	else{
		var lTransform = (GameObject.Find(theLeader.car.name + "/cartelaContainer") as GameObject).transform;
		transform.rotation = lTransform.rotation;
	}
}

