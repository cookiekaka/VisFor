var file = "../data/score_topic.json";//默认点击主题
var flag = "topic";
var time = "day";//默认点击每日
var turn = "horizontal";//默认横向
document.getElementById("b1").style.background="#e6e6e6";//按钮下沉
document.getElementById("b3").style.background="#e6e6e6";
scoreView(file);

function topicClick(){
	file = "../data/score_topic.json";
	flag = "topic";
	svgRemove();
	scoreView(file);
	document.getElementById("b1").style.background="#e6e6e6";
	document.getElementById("b2").style.background="white";
}
function classClick(){
	file = "../data/score_talkClass.json";
	flag = "talkClass";
	svgRemove();
	scoreView(file);
	document.getElementById("b2").style.background="#e6e6e6";
	document.getElementById("b1").style.background="white";
}
function dayClick(){
	time = "day";
	svgRemove();
	scoreView(file);
	document.getElementById("b3").style.background="#e6e6e6";
	document.getElementById("b4").style.background="white";
}
function weekClick(){
	time = "week";
	svgRemove();
	scoreView(file);
	document.getElementById("b4").style.background="#e6e6e6";
	document.getElementById("b3").style.background="white";
}
function turnClick(){
	if(turn == "horizontal"){turn = "portrait";}
	else{turn = "horizontal";}
	svgRemove();
	scoreView(file);
}