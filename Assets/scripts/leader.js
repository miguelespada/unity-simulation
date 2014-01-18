#pragma strict
private var cars: Array;
public var leader: int = 0;
public var car: GameObject;
public var updateLeader: boolean = false;

function Start () {
	cars =  GameObject.FindGameObjectsWithTag ("car");
	if(cars.length == 0) return;
	car = cars[0];
	setLeader(car);
	leader = parseInt(car.name);
}

function Update(){
	if(Input.GetKeyDown("l")) 
		updateLeader = true;
	if(updateLeader){
		updateLeader = false;
		cars =  GameObject.FindGameObjectsWithTag ("car");
		for(var c:GameObject in cars){
			if(parseInt(c.name) == leader){
				setLeader(c);
				break;
			}
		}
	}

}

function setLeader(c){
	(GameObject.Find(car.name+"/Cube").GetComponent("setMaterial") as setMaterial).setFocus(false);
	car = c;
	leader = parseInt(car.name);
	(GameObject.Find(car.name+"/Cube").GetComponent("setMaterial") as setMaterial).setFocus(true);
}