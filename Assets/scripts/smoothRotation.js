#pragma strict
var parentScript: life;
var smoothRotation:float = 10;

function LateUpdate () {
	if(!parentScript) {
		parentScript = transform.parent.GetComponent("life") as life;
	}
	else{
		transform.rotation = Quaternion.Slerp(transform.rotation, 
								parentScript.carRotation, 
								Time.deltaTime * smoothRotation);	
	}
}