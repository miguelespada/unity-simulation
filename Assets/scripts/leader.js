#pragma strict
private var cars: Array;
private var leader: int = 0;
public var car: GameObject;

private var lastChecked: int = 0;
public var teorico: loadTrack;

function Start () {
	cars =  GameObject.FindGameObjectsWithTag ("car");
	teorico = GameObject.Find("teorico").GetComponent("loadTrack") as loadTrack;
	if(cars.length == 0)
		return;
	car = cars[0];
}

function Update(){
 checkLeader();
}

function setLeader(carName){
	if(carName == car.name) return;
	for(var c:GameObject in cars){
		if(c.name == carName){
			(GameObject.Find(car.name+"/Cube").GetComponent("setMaterial") as setMaterial).setFocus(false);
			car = c;
			(GameObject.Find(car.name+"/Cube").GetComponent("setMaterial") as setMaterial).setFocus(true);
			updateLeader();
			break;

		}
	}
	
	(GameObject.Find(car.name+"/Cube").GetComponent("setMaterial") as setMaterial).setFocus(false);
	car = cars[0];
	(GameObject.Find(car.name+"/Cube").GetComponent("setMaterial") as setMaterial).setFocus(true);
	updateLeader();
}

function updateLeader(){
    var hostName = teorico.hostName;
	var query = hostName + "php/updateLeader.php?car="+ car.name;
	var hs_get = WWW(query);
 	yield hs_get; 
}

function checkLeader(){	
	if(lastChecked + 1 > Time.time) return;
	lastChecked = Time.time;
	
	var hostName = teorico.hostName;
	var query = hostName + "php/leader.php";
	var hs_get = WWW(query);
 	yield hs_get; 
 	if(hs_get.error) 
    	print("There was an error loading... " + query);
	 
    var fileContents = hs_get.text;
 	var lines = fileContents.Split("\n"[0]); 
 	
 	for (line in lines) {
    	if(line == "") break;
		setLeader(line);
 		break;
  	}
}