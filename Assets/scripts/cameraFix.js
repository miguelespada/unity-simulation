#pragma strict
private var leader: leader;

function Start () {	
	leader = GameObject.Find("controller").GetComponent("leader") as leader;
}

function Update () {
	if (camera.enabled && !Input.GetKey ("c")){
		if (Input.GetKey ("q")){
			camera.fieldOfView -= 1;
			if(camera.fieldOfView <= 10) camera.fieldOfView = 10;
		
		}
		if (Input.GetKey ("a"))
			camera.fieldOfView += 1;
		
	}
	
	if(!leader) return;
	transform.LookAt(leader.car.transform);
	
	
}