#pragma strict
var parentScript: life;
var smoothRotation:float = 10;

function Start () {
	parentScript = transform.parent.GetComponent("life") as life;
}

function LateUpdate () {
	transform.rotation = Quaternion.Slerp(transform.rotation, 
								parentScript.carRotation, Time.deltaTime * smoothRotation);	
}