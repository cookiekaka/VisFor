var file = "../data/discuss.json";
var click = discussView(file);
document.getElementById("b1").style.background="#e6e6e6";
document.getElementById("b3").style.background="#e6e6e6";
function topicClick(){
	file = "../data/discuss.json";
	svgRemove();
	click = discussView(file);
	document.getElementById("b1").style.background="#e6e6e6";
	document.getElementById("b2").style.background="white";
}
function sourceClick(){
	file = "../data/discussSource.json";
	svgRemove();
	click = discussView(file);
	document.getElementById("b2").style.background="#e6e6e6";
	document.getElementById("b1").style.background="white";
}
var day = 1;
function dayClick(){
	day = 1;
	svgRemove();
	click = discussView(file);
	document.getElementById("b3").style.background="#e6e6e6";
	document.getElementById("b4").style.background="white";
}
function weekClick(){
	day = 2;
	svgRemove();
	click = discussView(file);
	document.getElementById("b4").style.background="#e6e6e6";
	document.getElementById("b3").style.background="white";
}