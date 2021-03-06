﻿private var cars: Array;
public var leaderValue: int = 0;
public var car: GameObject;
public var updateLeader: boolean = false;

function Start () {
	cars =  GameObject.FindGameObjectsWithTag ("car");
	if(cars.length == 0) return;
	car = cars[0];
	setLeader(car);
	leaderValue = parseInt(car.name);
}

function Update(){
    
 	var script = car.GetComponent("life") as life;
 	
	if(!car.active || !script.isEnabled){
    	cars =  GameObject.FindGameObjectsWithTag ("car");
    	for(var c:GameObject in cars){
    		if(!c.active) continue;
			script = c.GetComponent("life") as life;
		
			if(script.isEnabled){
				setLeader(c);
				leaderValue = parseInt(car.name);
				break;
			}
			
    	}
    	return;
    }
    
	if(Input.GetKeyDown("l")) 
		updateLeader = true;
	if(updateLeader){
		updateLeader = false;
		cars =  GameObject.FindGameObjectsWithTag ("car");
		for(var c:GameObject in cars){
			if(parseInt(c.name) == leaderValue){
				setLeader(c);
				break;
			}
		}
	}

}

function setLeader(c){
	if(!car.active){
		car.active = true;
		car.transform.Find("cartelaContainer/marca").active = false;
		car.active = false;
	}
	else{
	
		car.transform.Find("cartelaContainer/marca").active = false;
	}
	car = c;
	leaderValue = parseInt(car.name);
	car.transform.Find("cartelaContainer/marca").active = true;
}
function newLeader(k){
	
	leaderValue = k;
	updateLeader = true;
}