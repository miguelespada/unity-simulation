#pragma strict
private var fixedCameras: Array;
private var fixedCameras_: Array;

private var cameraCar: GameObject;
private var cameraTop: GameObject;
private var cameraFollow: GameObject;
private var cameraOrbit: GameObject;

private var cameraCar_: GameObject;
private var cameraTop_: GameObject;
private var cameraFollow_: GameObject;
private var cameraOrbit_: GameObject;

private var theCamera: GameObject;
private var theCamera_: GameObject;
private var n = -1;
private var focus: boolean;

function Start () {
	var i = 0;
	fixedCameras = new Array();
	fixedCameras_ = new Array();
	while(true){
		var c = GameObject.Find("c_" + i) as GameObject;
		if(c){
			fixedCameras.push(c);
			var c_ = myClone(c);
			fixedCameras_.push(c_);
			c.camera.enabled = false;
			c_.camera.enabled = false;
		}
		else
			break;
		i += 1;
		n = 0;
		focus = false;
	}
	
	
	cameraTop = GameObject.Find("cameraTop");
	cameraTop.camera.enabled = false;
	cameraTop_ = myClone(cameraTop);
	cameraTop_.camera.enabled = false;
		
	cameraCar = GameObject.Find("cameraCar");
	cameraCar.camera.enabled = false;
	cameraCar_ = myClone(cameraCar);
	cameraCar_.camera.enabled = false;
	
	
	cameraFollow = GameObject.Find("cameraFollow");
	cameraFollow.camera.enabled = false;
	cameraFollow_ = myClone(cameraFollow);
	cameraFollow_.camera.enabled = false;
	
	cameraOrbit = GameObject.Find("cameraOrbit");
	cameraOrbit.camera.enabled = false;
	cameraOrbit_ = myClone(cameraOrbit);
	cameraOrbit_.camera.enabled = false;

	
	theCamera = cameraTop;
	theCamera_ = cameraTop_;
	theCamera.camera.enabled = true;
	theCamera_.camera.enabled = true;
	
		Screen.showCursor = false;
	
}
function myClone(cam:GameObject){

	var cam_:GameObject =  Instantiate(cam) as GameObject;
	cam_.name = cam.name + "_";
	cam_.camera.depth = cam.camera.depth + 1;
	cam_.camera.clearFlags =  CameraClearFlags.Depth;
	cam_.camera.cullingMask = (1 << LayerMask.NameToLayer("car"));
	cam_.transform.parent = cam.transform.parent;
	return cam_;
}
function Update () {
	if(Input.GetKeyDown ("1") || Input.GetKeyDown ("2") || Input.GetKeyDown ("3") 
		|| Input.GetKeyDown ("4") || Input.GetKeyDown ("5") || Input.GetKeyDown ("6")){
		
		theCamera.camera.enabled = false;
		theCamera_.camera.enabled = false;
	
	}
	
	if (Input.GetKeyDown ("1")){
		theCamera = cameraTop;
		theCamera_ = cameraTop_;
	}
	
	if (Input.GetKeyDown ("2")){
		theCamera = cameraCar;
		theCamera_ = cameraCar_;
	}
	
	if (Input.GetKeyDown ("3")){
		theCamera = cameraFollow;
		theCamera_ = cameraFollow_;
	}
	
	if (Input.GetKeyDown ("4")){
		theCamera = cameraOrbit;
		theCamera_ = cameraOrbit_;
	}
	
	if (Input.GetKeyDown ("5") && n != -1){
		if(! focus) focus = true;
		else n = n + 1;
		if(n < 0 ) n = 0;
		if(n >= fixedCameras.length) n = fixedCameras.length - 1;
		theCamera = fixedCameras[n];
		theCamera_ = fixedCameras_[n];
		
		
	}
	
	if (Input.GetKeyDown ("6") && n != -1){
		if(! focus) focus = true;
		else n = n - 1;
		
		if(n < 0 ) n = 0;
		if(n >= fixedCameras.length) n = fixedCameras.length - 1;
		
		theCamera = fixedCameras[n];
		theCamera_ = fixedCameras_[n];
	}
	
	
	if(Input.GetKeyDown ("1") || Input.GetKeyDown ("2") || Input.GetKeyDown ("3") 
		|| Input.GetKeyDown ("4") || Input.GetKeyDown ("5") || Input.GetKeyDown ("6")){
		
		theCamera.camera.enabled = true;
		theCamera_.camera.enabled = true;
	}

	
	
	
}