	var windowRect0 : Rect = Rect (20, 20, 120, 50);
	var windowRect1 : Rect = Rect (20, 100, 120, 50);
	function OnGUI () {
		// Here we make 2 windows. We set the GUI.color value to something before each.
		GUI.color = Color.red;		
		windowRect0 = GUI.Window (0, windowRect0, DoMyWindow, "Red Window");
		GUI.color = Color.green;		
		windowRect1 = GUI.Window (1, windowRect1, DoMyWindow, "Green Window");
	}
	// Make the contents of the window.
	// The value of GUI.color is set to what it was when the window
	// was created in the code above.
	function DoMyWindow (windowID : int) {
		if (GUI.Button (Rect (10,20,100,20), "Hello World"))
			print ("Got a click in window with color " + GUI.color);
		// Make the windows be draggable.
		GUI.DragWindow (Rect (0,0,10000,10000));
	}