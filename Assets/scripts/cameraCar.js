#pragma strict

public var altura: int = 60;
private var leader: leader;

function Start () {
	leader = GameObject.Find("controller").GetComponent("leader") as leader;
}

function Update () {
	
	
	if (camera.enabled && !Input.GetKey ("c")){
		if (Input.GetKey ("q")){
			altura -= 1;
			if(altura == 0) altura = 0;
		}
		if (Input.GetKey ("a")){
			altura += 1;
		}
	}	
	if(!leader) return;
	
	var destination: Vector3 = new Vector3(leader.car.transform.position.x, 
						leader.car.transform.position.y + altura, 
						leader.car.transform.position.z);
	transform.position = Vector3.MoveTowards(transform.position, destination, 6);

	
}
 


 