
var target : Transform;
// The distance in the x-z plane to the target
var distance = 10.0;
// the height we want the camera to be above the target
var height = 5.0;
// How much we 
var heightDamping = 2.0;
var rotationDamping = 3.0;

private var leader;


function LateUpdate () {
	if(!leader) return;
	target = leader.car.transform;
	// Early out if we don't have a target
	if (!target)
		return;
	
	// Calculate the current rotation angles
	var wantedRotationAngle = target.eulerAngles.y;
	var wantedHeight = target.position.y + height;
		
	var currentRotationAngle = transform.eulerAngles.y;
	var currentHeight = transform.position.y;
	
	// Damp the rotation around the y-axis
	currentRotationAngle = Mathf.LerpAngle (currentRotationAngle, wantedRotationAngle, rotationDamping * Time.deltaTime);

	// Damp the height
	currentHeight = Mathf.Lerp (currentHeight, wantedHeight, heightDamping * Time.deltaTime);

	// Convert the angle into a rotation
	var currentRotation = Quaternion.Euler (0, currentRotationAngle, 0);
	
	// Set the position of the camera on the x-z plane to:
	// distance meters behind the target
	transform.position = target.position;
	transform.position -= currentRotation * Vector3.forward * distance;

	// Set the height of the camera
	transform.position.y = currentHeight;
	
	// Always look at the target
	transform.LookAt (target);
	
	
	if (camera.enabled && !Input.GetKey ("c")){
		if (Input.GetKey ("q")){
			camera.fieldOfView -= 1;
			if(camera.fieldOfView <= 10) camera.fieldOfView = 10;
		}
		if (Input.GetKey ("a")){
			camera.fieldOfView += 1;
		}
		
		if (Input.GetKey (KeyCode.UpArrow ))
			height += 1;
		if (Input.GetKey (KeyCode.DownArrow ))
			height -= 1;
		
	}
}

function Start () {
	leader = GameObject.Find("controller").GetComponent("leader");
}