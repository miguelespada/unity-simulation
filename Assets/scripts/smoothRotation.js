#pragma strict
var parentScript: life;
var smoothRotation:float = 10;

function Start () {
	parentScript = transform.parent.GetComponent("life") as life;
}

function Update () {
	var destination = parentScript.destination; 
	if(destination - transform.position != Vector3.zero){
			var rotation = Quaternion.LookRotation(destination - transform.position);
			transform.rotation = Quaternion.Slerp(transform.rotation, 
								rotation, Time.deltaTime * smoothRotation);	
	}
}