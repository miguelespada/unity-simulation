var cars = Array();
private var s: String;
private var lastPeriod: int = 0;
private var leader: leader; 
private var controller: controller; 
private var classification: Array; 
public	var guitexts : GUIText[]; 
public var isEnabled: boolean = true;
private var ranks: Array;
public var rankPrefab: Transform;
public var leyenda: GUIText;
public var isBaliza: boolean;
public var baliza: baliza;

function Start () {
 cars = GameObject.FindGameObjectsWithTag ("car");
 leader = GameObject.Find("controller").GetComponent("leader") as leader;  
 controller = GameObject.Find("controller").GetComponent("controller") as controller;
 leyenda = GameObject.Find("classification/p0/text").GetComponent("GUIText") as GUIText;  
 buildRanks();
 baliza = GameObject.FindGameObjectWithTag("baliza").GetComponent("baliza") as baliza;  

}
function buildRanks(){
 var i = 1;
 ranks = new Array();
 for(var c: GameObject in cars){
 	var r = Instantiate(rankPrefab) as Transform;
 	r.name = "rank_" + c.name;
 	r.parent = transform;
 	r.localScale = Vector3(1, 1, 0);
 	r.localPosition = Vector3(0, -1.05 * i, 0);
 	r.Find("id").guiText.text = "" + c.name;
 	
 	i += 1;
 	ranks.push(r);
 }
 guitexts = gameObject.GetComponentsInChildren.<GUIText>();
}

function buildClassification(){
	classification =  Array();
	for (var car in cars){
		if(!car.active) continue;
		var script = car.GetComponent("life") as life;
		if(!script) continue;
		if(!script.isEnabled) continue;
		var p = Array();
		p[0] = car.name;
		p[1] = script.remainingDst;
		p[2] = script.speed;
		p[3] = script.status; 
		p[4] = script.carName; 
		p[5] = script.timeFromStart; 
		
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
	}
	
}

function Update () {
	if(Input.GetKeyDown ("b")) {
		isBaliza = !isBaliza;
		if(isBaliza) baliza.reset();
	}
	if(!leader) return;
	
	if (Input.GetKeyDown ("k")){
		var n:int = parseInt(getNext());
		leader.newLeader(n);
		lastPeriod = Time.time - 5;
	}
	if (Input.GetKeyDown ("i")){
		n = parseInt(getPrev());
		leader.newLeader(n);
		lastPeriod = Time.time - 5;
	}
	
	setPosition();	
	
	if( Time.time < lastPeriod + 1) return;
	
	lastPeriod = Time.time;
	disableRanks();
	
	if(isBaliza){
		var dst = (baliza.distance/1000).ToString("F1");
		leyenda.text = "Tiempos km: " + dst;
		
		displayBaliza();
		
	}
	else{
		buildClassification();
		if(controller.state == 0){
			leyenda.text = "Tiempos";
		}
		else{
			leyenda.text = "Tiempos relativos";
		}
		 // Check the focus car
		var reference = 0;
		for(var clas in classification){
			if(clas[0] == leader.car.name){
				reference = clas[1];
				break;
			}
		}
		displayClasificacion(reference);
	//---- 
	}
}


function displayBaliza(){
	var j = 1;
 	for(var i = 0; i < baliza.n; i++){
 		var id = baliza.clasificacion[i];
 		var r = getRankByName(id);
 		
		if(!r) continue;
		if(!r.gameObject.renderer.isVisible) continue;
		r.active = true;
		r.localPosition = Vector3(0, -1.05 * (j + 1), 0);
		j += 1;
		r.Find("marca").active = false;
		r.Find("id").guiText.text = id;
		r.Find("name").guiText.text = (GameObject.Find(id).GetComponent("life") as life).carName;
		r.Find("value").guiText.text = setAbsoluteTime(parseInt(baliza.tiempos[i]));
		r.GetComponent("setTexture").setTexture("red");

 	}
}

function displayClasificacion(reference){
	i = 1;
	var color = "green";
	if(controller.state == 0) color = "red";
	
	for(var clas in classification){
		var r = getRankByName(clas[0]);
		if(!r) continue;
		
		r.active = true;
		r.localPosition = Vector3(0, -1.05 * i, 0);
		
		r.Find("id").guiText.text = clas[0];
		r.Find("name").guiText.text = clas[4];
		i += 1;		
					
		var theTime =  clas[5];
		
		if(clas[0] == leader.car.name){
			r.Find("marca").active = true;
			if(controller.state == 0){
				r.Find("value").guiText.text = setAbsoluteTime(parseInt(theTime));
				
			}
			else{
				r.Find("value").guiText.text = "-";
				
				color = "red";
			}
		}
		else{
			r.Find("marca").active = false;
			if(controller.state == 0)
				r.Find("value").guiText.text = setAbsoluteTime(parseInt(theTime));
			else{
				r.Find("value").guiText.text = setRelativeTime(reference, clas);	
							
			}
		}
		r.GetComponent("setTexture").setTexture(color);
	}
}



function setAbsoluteTime(tiempo){
	if(tiempo % 60 < 10)
		return "" + tiempo/60 + ":0" + tiempo%60;	
	else		
		return "" + tiempo/60 + ":" + tiempo%60;
}	
function setRelativeTime(reference, clas){
	var dst = reference - clas[1] ;
	var dstInTime :int = 0;
	if(clas[2] != 0) dstInTime = (dst / clas[2]);
	if(dstInTime >= 0){
		return "-" + parseInt(dstInTime) + " s";	
		
	}	
	else{
		return "+" + Mathf.Abs(parseInt(dstInTime)) + " s";
	}
}
function disableRanks(){
	for(var r in ranks) r.active = false;
}
function getRankByName(carName){
	for(var r in ranks){
		if(r.name.EndsWith("_" + carName)) return r;
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


