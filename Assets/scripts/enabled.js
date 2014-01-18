#pragma strict

public var isEnabled: boolean = true;
private var allMyRenderers: Array;
function Start () {
	allMyRenderers = GetComponentsInChildren(Renderer);
}

function Update () {
	activeChildren(isEnabled);
}

function activeChildren(b){
    for (var renderer : Renderer in allMyRenderers) 
       renderer.enabled = b ;
}
