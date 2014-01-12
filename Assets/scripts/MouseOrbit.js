
var targetPos : Vector3;
var distance = 10.0;

var xSpeed = 250.0;
var ySpeed = 120.0;

var yMinLimit = -20;
var yMaxLimit = 80;

private var x = 0.0;
private var y = 0.0;
private var theLeader;


function Start () {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;

	theLeader = GameObject.Find("controller").GetComponent("leader");
	if(!theLeader) {
		yield WaitForSeconds(1);
		theLeader = GameObject.Find("controller").GetComponent("leader");
	}
	targetPos = theLeader.car.transform.position;

}

function LateUpdate () {
	if(theLeader){
		targetPos = Vector3.Lerp(targetPos, theLeader.car.transform.position, Time.deltaTime );

        x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
        y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
 		
 		y = ClampAngle(y, yMinLimit, yMaxLimit);
 		       
        var rotation = Quaternion.Euler(y, x, 0);
        var position = rotation * Vector3(0.0, 0.0, -distance) + targetPos;
        
        transform.rotation = rotation;
        transform.position = position;
         
	}
    
    if (camera.enabled && !Input.GetKey ("c")){
		if (Input.GetKey ("q")){
			camera.fieldOfView -= 1;
			if(camera.fieldOfView <= 10) camera.fieldOfView = 10;
		}
		if (Input.GetKey ("a")){
			camera.fieldOfView += 1;
		}
	}
}

static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}