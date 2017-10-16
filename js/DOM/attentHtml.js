var w=window.innerWidth//浏览器窗口的宽度
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h=window.innerHeight//浏览器窗口的高度
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var threshold = 5;
function five(){
	threshold = 5;
	document.getElementById("b1").style.background="#e6e6e6";
	document.getElementById("b2").style.background="white";
	document.getElementById("b3").style.background="white";
	svgRemove();
	draw();
}
function ten(){
	threshold = 10;
	document.getElementById("b2").style.background="#e6e6e6";
	document.getElementById("b1").style.background="white";
	document.getElementById("b3").style.background="white";
	svgRemove();
	draw();
}
function fifteen(){
	threshold = 15;
	document.getElementById("b3").style.background="#e6e6e6";
	document.getElementById("b1").style.background="white";
	document.getElementById("b2").style.background="white";
	svgRemove();
	draw();
}
function draw(){
	var fileNum = 3;//待检测文件数量
	for(i=0;i<1;i++){//JavaScript无法访问本地文件，所以暂时只能这样
		if(threshold < 9)
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent2.json");//9
		if(fileNum==1)break;
		if(threshold < 14)
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent2.json");//14
		if(fileNum==2)break;
		if(threshold < 20)
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent4.json");//20
		if(fileNum==3)break;
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent4.json");
		if(fileNum==4)break;
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent5.json");
		if(fileNum==5)break;
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent6.json");
		if(fileNum==6)break;
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent7.json");
		if(fileNum==7)break;
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent8.json");
		if(fileNum==8)break;
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent9.json");
		if(fileNum==9)break;
		document.getElementsByClassName("attent").innerHTML=attentView("../data/attent10.json");
	}
}
five();