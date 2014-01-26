#pragma strict
public var red: Texture2D;
public var green: Texture2D;

function setTexture(v){
	if(v == "red"){
		guiTexture.texture = red;
	}
	if(v == "green"){
		guiTexture.texture = green;
	}
}