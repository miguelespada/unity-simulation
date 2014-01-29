#pragma strict

public var altura: int = 60;
private var baliza: GameObject;

function Start () {
	 baliza = GameObject.FindGameObjectWithTag("baliza");  
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
	if(!baliza) return;
	
	var destination: Vector3 = new Vector3(baliza.transform.position.x, 
						baliza.transform.position.y + altura, 
						baliza.transform.position.z);
	transform.position = Vector3.MoveTowards(transform.position, destination, 6);

	
}
 


 