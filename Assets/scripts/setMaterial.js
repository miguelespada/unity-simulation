#pragma strict


function setFocus(b){
	if(b){
		renderer.material = Resources.Load("carMaterials/focus");
	}
	else{
		renderer.material = Resources.Load("carMaterials/normal");
		
	}
}