#pragma strict

private var lastChecked: int = 0;
public var teorico: loadTrack;
public var isEnabled: boolean = true;
function Start () {
	teorico = GameObject.Find("teorico").GetComponent("loadTrack") as loadTrack;
}

function Update () {
	checkEnabled();
}

function checkEnabled(){	
	if(lastChecked + 1 > Time.time) return;
	lastChecked = Time.time;
	
	var hostName = teorico.hostName;
	var query = hostName + "php/enabled.php?car="+ gameObject.name;
	var hs_get = WWW(query);
 	yield hs_get; 
 	if(hs_get.error) 
    	print("There was an error loading... " + query);
	 
    var fileContents = hs_get.text;
 	var lines = fileContents.Split("\n"[0]); 
 	
 	for (line in lines) {
    	if(line == "") break;
    	isEnabled = parseInt(line) == 1;
 		if(isEnabled)
			activeChildren(true);		
		else
 			activeChildren(false);
 		break;
  }
}

function activeChildren(b){
	var allMyRenderers = GetComponentsInChildren(Renderer);
    for (var renderer : Renderer in allMyRenderers) {
       renderer.enabled = b ;
     }
}
