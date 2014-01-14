var cars = Array();
private var s: String;
private var lastPeriod: int = 0;
private var leader: leader; 
private var classification: Array; 
public	var guitexts : GUIText[]; 
public var isEnabled: boolean = true;
private var ranks: Array;
public var rankPrefab: Transform;
function Start () {
 cars = GameObject.FindGameObjectsWithTag ("car");
 leader = GameObject.Find("controller").GetComponent("leader") as leader;  
 var i = 1;
 ranks = new Array();
 for(var c: GameObject in cars){
 	var r = Instantiate(rankPrefab) as Transform;
 	r.name = "rank_" + c.name;
 	r.parent = transform;
 	r.localScale = Vector3(1, 1, 0);
 	r.localPosition = Vector3(0, -1.05 * i, 0);
 	r.Find("id").guiText.text = "" + i;
 	r.Find("number").guiText.text = c.name;
 	i += 1;
 	ranks.push(r);
 }
 guitexts = gameObject.GetComponentsInChildren.<GUIText>();
}

function Update () {
	if(!leader.car) return;
	if(Input.GetKeyDown ("k") || Input.GetKeyDown ("i") || Time.time > lastPeriod + 2){
		lastPeriod = Time.time;
		s = "";
		classification =  Array();
		for (var car in cars){
			var script = car.GetComponent("life") as life;
			if(!script) return;
			var p = Array();
			p[0] = car.name;
			p[1] = script.remainingDst;
			p[2] = script.speed;
			p[3] = script.status; 
			p[4] = script.timeFromStart; 
			//s += car.name + "\t" + script.pos + "\n";
			var before = Array();
			var i : int = 0;
			while(i < classification.length ){
				var c: Array = classification[i];
				if(c[1] < p[1])
					before.push(c);
				else
					break;
				i ++;
			}
			before.push(p);
			while(i < classification.length ){
				before.push(classification[i]);
				i ++;
			}
			
			for(var j = 0; j < before.length; j++)
				classification[j] = before[j];
			
			
			s = "";
	
			var reference = 0;
	
			for(var clas in classification){
				if(clas[0] == leader.car.name)
					reference = clas[1];
			}
			
			var dst = 0;
			i = 1;
			for(var clas in classification){
					
					var r = getRankByName(clas[0]);
 					r.localPosition = Vector3(0, -1.05 * i, 0);
					r.Find("id").guiText.text = "" + i;
					i += 1;
					r.active = true;
					
					dst = reference - clas[1] ;
					var dstInTime :int = 0;
					if(clas[2] != 0)
						dstInTime = (dst / clas[2]);
						
					if(clas[0] == leader.car.name){
						
						s += "*";
						r.Find("marca").active = true;
						r.Find("value").guiText.text = "-";
						
						if(clas[3] == "ended"){
							s += clas[0] + "   +" + clas[4];
							s += "s + " + clas[3] + "\n"; 
							r.active = false;
						}
						else{
							s += clas[0] + " " + clas[1] + "m "+ "\n";
						}
					}
					
					else{
						r.Find("marca").active = false;
					
						r.Find("value").guiText.text = "";
						if(clas[3] == "ended"){
							s += clas[0] + "   +" + clas[4];
							s += "s + " + clas[3] + "\n";
							r.active = false; 
						}
						else if(clas[3] == "start"){
							s += clas[0] + " " + clas[3] + "\n";
							r.active = false;
						}
						else{
							if(dstInTime >= 0){
								s += clas[0] + "   +" + dstInTime; 
									
								r.Find("value").guiText.text = "+" + dstInTime + "s";		
								}
							else{
								s += clas[0] + "   -" + Mathf.Abs(dstInTime);
								
								r.Find("value").guiText.text = "-" + Mathf.Abs(dstInTime) + "s";		
							}
							s += "s \n";
						}
					}	
			}	
		}
			
		guiText.text = s;
	}
	
	if (Input.GetKeyDown ("k")){
		leader.setLeader(getNext());
		lastPeriod = Time.time - 5;
	}
	if (Input.GetKeyDown ("i")){
		leader.setLeader(getPrev());
		lastPeriod = Time.time - 5;
	}
		
	
	setPosition();	
	
}
function getRankByName(carName){
	for(var r in ranks){
		if(r.name.EndsWith(carName)) return r;
	}
	return null;
}
function getNext(){
	for(var i = 0; i < classification.length; i++ ){
		if(classification[i][0] == leader.car.name){
			if (i == classification.length - 1) return leader.car.name;
			return classification[i + 1][0];
		}
	}	
	return leader.car.name;
}

function getPrev(){
	for(var i = classification.length - 1; i >= 0; i-- ){
		if(classification[i][0] == leader.car.name){
			if (i == 0) return leader.car.name;
			return classification[i - 1][0];
		}
	}	
	return leader.car.name;
}
 
function activeChildren(b){
	for (var child : Transform in transform) {
		 child.active = b;
	}
}

function setPosition(){

	if(Input.GetKey ("c")){ 
		if(Input.GetKeyDown("z")){  
			isEnabled = !isEnabled;
			activeChildren(isEnabled);
		}
			
		if (Input.GetKey ("q")) {
			transform.localScale *= 1.1;
		
		 }
		if (Input.GetKey ("a")){
			transform.localScale *= 0.9;
			
		} 
		if (Input.GetKey ("e")) {
			
			for (var gui : GUIText in guitexts)  {
				gui.fontSize += 1;  
			}
		
		 }
		if (Input.GetKey ("d")){
			for (var gui : GUIText in guitexts) {
				gui.fontSize -= 1;   
				
				if(gui.fontSize <= 1) gui.fontSize = 1;
			}
		} 
			 
		if (Input.GetKey (KeyCode.UpArrow ))
			transform.position.y += 0.01;
		if (Input.GetKey (KeyCode.DownArrow ))
			transform.position.y -= 0.01;
		
		if (Input.GetKey (KeyCode.LeftArrow ))
			transform.position.x -= 0.01;
		if (Input.GetKey (KeyCode.RightArrow ))
			transform.position.x += 0.01;
	}
}