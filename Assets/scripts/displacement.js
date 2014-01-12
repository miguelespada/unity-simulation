#pragma strict

function Start () {
	var dH = (Random.value - 0.5) * 2;
	transform.localPosition.x += dH;
	transform.localScale *= (1 + (Random.value * 0.1));
}
