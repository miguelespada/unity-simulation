#pragma strict
public var targetCamera: Transform;

function Start () {
}

function Update () {
	transform.LookAt(targetCamera);
}