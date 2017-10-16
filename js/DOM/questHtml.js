var w=window.innerWidth//浏览器窗口的宽度
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h=window.innerHeight//浏览器窗口的高度
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var paper0 = ".sum";
var paper1 = ".sep1";
var paper2 = ".sep2";
var paper3 = ".sep3";
var paper4 = ".sep4";
var paper5 = ".sep5";
var paper6 = ".sep6";
var paper7 = ".sep7";
var paper8 = ".sep8";
var paper9 = ".sep9";
var paper10 = ".sep10";
var width1 = w*0.3;
var width2 = h*0.3;
var colorArray1=["#f09ba0","#fff500","#667bb4","#e8a000"];
var colorArray2=["red","#0193de","#00923f"];
var title0 = "所有发言";
var title1 = "主题一";
var title2 = "主题二";
var title3 = "主题三";
var title4 = "主题四";
var title5 = "主题五";
var title6 = "主题六";
var title7 = "主题七";
var title8 = "主题八";
var title9 = "主题九";
var title10 = "主题十";
var file0 = "../data/questScore.json";
var file1 = "../data/questScore1.json";
var file2 = "../data/questScore2.json";
var file3 = "../data/questScore3.json";
var file4 = "../data/questScore4.json";
var file5 = "../data/questScore5.json";
var file6 = "../data/questScore6.json";
var file7 = "../data/questScore7.json";
var file8 = "../data/questScore8.json";
var file9 = "../data/questScore9.json";
var file10 = "../data/questScore10.json";

var fileNum = 4;//待检测文件数量
var flag = "score";
function scoreClick(){//点击成绩按钮时，所用的文件
	flag = "score";
	file0 = "../data/questScore.json";
	file1 = "../data/questScore1.json";
	file2 = "../data/questScore2.json";
	file3 = "../data/questScore3.json";
	file4 = "../data/questScore4.json";
	file5 = "../data/questScore5.json";
	file6 = "../data/questScore6.json";
	file7 = "../data/questScore7.json";
	file8 = "../data/questScore8.json";
	file9 = "../data/questScore9.json";
	file10 = "../data/questScore10.json";
	document.getElementById("b1").style.background="#e6e6e6";
	document.getElementById("b2").style.background="white";
	svgRemove();	
	draw();
}
function attentClick(){//点击关注度按钮时，所用的文件
	flag = "attention";
	file0 = "../data/questAttent.json";
	file1 = "../data/questAttent1.json";
	file2 = "../data/questAttent2.json";
	file3 = "../data/questAttent3.json";
	file4 = "../data/questAttent4.json";
	file5 = "../data/questAttent5.json";
	file6 = "../data/questAttent6.json";
	file7 = "../data/questAttent7.json";
	file8 = "../data/questAttent8.json";
	file9 = "../data/questAttent9.json";
	file10 = "../data/questAttent10.json";
	document.getElementById("b2").style.background="#e6e6e6";
	document.getElementById("b1").style.background="white";
	svgRemove();	
	draw();
	console.log("按下关注度");
}
scoreClick();