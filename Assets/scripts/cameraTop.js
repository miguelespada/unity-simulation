function Update () {
	if (camera.enabled  && !Input.GetKey ("c")){
		if (Input.GetKey ("q"))
			camera.fieldOfView -= 1;
		
		if (Input.GetKey ("a"))
			camera.fieldOfView += 1;
			
		if (Input.GetKey (KeyCode.UpArrow ))
			transform.position.z += 10;
		if (Input.GetKey (KeyCode.DownArrow ))
			transform.position.z -= 10;
		
		if (Input.GetKey (KeyCode.LeftArrow ))
			transform.position.x -= 10;
		if (Input.GetKey (KeyCode.RightArrow ))
			transform.position.x += 10;
	}	
}