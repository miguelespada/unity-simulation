function Start () {
	var fileName = "cartelas/c"+ transform.parent.parent.name;
	renderer.material.mainTexture = Resources.Load(fileName, Texture2D);
}

