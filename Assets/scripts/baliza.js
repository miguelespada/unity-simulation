#pragma strict

private var teorico: loadTrack;
function Start () {
	teorico = GameObject.Find("teorico").GetComponent("loadTrack") as loadTrack;
	while(!teorico.ready){
		yield WaitForSeconds (1);
	} 
}

function Update () {

}