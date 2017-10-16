function svgRemove(){
	var remove = d3.selectAll("svg");
	remove.remove();
}
function draw(){
	document.getElementsByClassName("sum").innerHTML=questView(paper0,width1,file0,colorArray1,title0);
	for(i=0;i<1;i++){//JavaScript无法访问本地文件，所以暂时只能这样
		document.getElementsByClassName("sep1").innerHTML=questView(paper1,width2,file1,colorArray2,title1);
		if(fileNum==1)break;
		document.getElementsByClassName("sep2").innerHTML=questView(paper2,width2,file2,colorArray2,title2);
		if(fileNum==2)break;
		document.getElementsByClassName("sep3").innerHTML=questView(paper3,width2,file3,colorArray2,title3);
		if(fileNum==3)break;
		document.getElementsByClassName("sep4").innerHTML=questView(paper4,width2,file4,colorArray2,title4);
		if(fileNum==4)break;
		document.getElementsByClassName("sep5").innerHTML=questView(paper5,width2,file5,colorArray2,title5);
		if(fileNum==5)break;
		document.getElementsByClassName("sep6").innerHTML=questView(paper6,width2,file6,colorArray2,title6);
		if(fileNum==6)break;
		document.getElementsByClassName("sep7").innerHTML=questView(paper7,width2,file7,colorArray2,title7);
		if(fileNum==7)break;
		document.getElementsByClassName("sep8").innerHTML=questView(paper8,width2,file8,colorArray2,title8);
		if(fileNum==8)break;
		document.getElementsByClassName("sep9").innerHTML=questView(paper9,width2,file9,colorArray2,title9);
		if(fileNum==9)break;
		document.getElementsByClassName("sep10").innerHTML=questView(paper10,width2,file10,colorArray2,title10);
	}
}
//绘制函数，变量分别为：画布，宽度，数据路径，颜色比例尺
function questView(paper,wid,json,colorArray,title){
	d3.json("../data/discuss.json", function(error, dAta){
	var daTa = dAta.topic;
	topicColor = d3.scale.ordinal()//主题标签的颜色比例尺
					.domain(daTa.map(function(d){ return d.name;}))
					.range(["#f09ba0","#fff500","#667bb4","#e8a000"]);
	})
	var width = wid;//绘制画板
	var height = width*1.3;
	var svg = d3.select(paper)
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform", "translate("+(width/2)+","+(width*0.6)+")");

	var radius = (width>height?height:width)/2*0.93;						
	var partition = d3.layout.partition()//创建分区图布局
						.sort(null)
						.size([2*Math.PI, radius])
						.value(function(d){ return d.value; });
	//console.log(json);
	d3.json(json, function(error, root){
		var nodes = partition.nodes(root);//转换数据
		var maxVlaue = 0;
		if(flag == "score"){maxVlaue = 100;}
		else{maxVlaue = 55;}
		var arc = d3.svg.arc()//创建弧生成器
						.startAngle(function(d){ return d.x; })
						.endAngle(function(d){ return d.x+d.dx; })
						.innerRadius(function(d){
							if(!d.children){
								return radius-d.dy/maxVlaue*d.value;//叶子节点根据value设定内半径的大小
							}
							else{return d.y-radius*0.03;}//内层圆弧
						})
						.outerRadius(function(d){
							if(!d.children)
							return radius;//d.y节点y坐标，d.dy节点的高度
							else return d.y+d.dy-radius*0.1;//内层圆弧距离外层更远
						});
		var gArc = svg.selectAll("g")
						.data(nodes)
						.enter()
						.append("g");
						
		var topicArray = new Array();//创建主题数组，作为颜色比例尺的值域
		for(var i=0; i<nodes.length; i++){
			if(nodes[i].children){
				topicArray.push(nodes[i].topic);
			}
		}
		topicArray.shift();//删除父节点，因为父节点是圆形的点，不绘制，没有颜色
		//console.log(topicArray);
		var color1 = d3.scale.ordinal()
						.domain(topicArray)
						.range(colorArray);
						
		gArc.append("path")
			.attr("display", function(d){//不绘制圆心
				return d.depth ? null : "none";
			})
			.attr("d", arc)
			.style("stroke", "white")
			.style("fill", function(d){
				return color1((d.children ? d : d.parent).topic);
			});
		
		//console.log(nodes.length);
		gArc.append("text")
			.attr("class", "nodetext")
			.attr("dy", ".5em")
			.style("font-size", function(d){//%%%根据最小字体为12px，计算出叶子节点的临界数目为130，大于130则不显示数字%%%
				if(nodes.length > radius*13/22)
				return "0px";
				else return "12px";
			})
			.attr("text-anchor", "middle ")
			.attr("transform", function(d, i){
				if(i!==0){
					var r = d.x+d.dx/2;
					var angle = Math.PI/2;
					r += r<Math.PI ? (angle*-1) : angle;
					r *= 180/Math.PI;
					var m = arc.centroid(d)[0] * 1.27;
					var n = arc.centroid(d)[1] * 1.27;
					return "translate("+m+", "+n+")rotate("+r+")";
				}
			})
			.text(function(d, i){
			if(i!==0&&(!d.children))
				return d.topic;
			});
		svg.append("text")
			.attr("transform", "translate(0, "+(width*0.65)+")")
			.attr("class", "nodetext")
			.attr("text-anchor", "middle")
			.text(title);
		
		var tooltip = d3.select("body")
						.append("div")
						.attr("class", "tooltip")
						.style("opacity", 0.0);
		gArc.on("mouseover", function(d){
				tooltip.html(function(){
					if(flag == "score"&&!d.children){return "成绩："+d.value;}
					if(flag == "attention"&&!d.children){return "关注度："+d.value;}
					else{return "数量："+d.children.length;}
				})//文字
						.style("left", (d3.event.pageX)+"px")
						.style("top", (d3.event.pageY+20)+"px")
						.style("opacity", 0.8);
				})
			.on("mousemove", function(d){
				tooltip.style("left", (d3.event.pageX)+"px")
						.style("top", (d3.event.pageY+20)+"px")
				
			})
			.on("mouseout", function(d){
				tooltip.style("opacity", 0.0);
			})
			.on("click", function(d){
				console.log(d);
				var $parent = $(window.parent.document);
				var $node = $parent.find("#frame5").contents().find(".term");
				var $a = $node.first();
				$a.nextAll().remove();
				d3.csv("../data/text.csv", function(error, data){
					//var $parent = $(window.parent.document);
					var $node = $parent.find("#frame5").contents().find(".term");
					//console.log($node);
					var $para = "";
					var $flg = $node;
					for(var i=0; i<data.length; i++){
						if(data[i].name==d.name&&data[i].date==d.date&&data[i].time==d.time){//根据点击circle的属性删选数据data
						$flg.children(".p1").children(".label.label-default").text(data[i].name);
						$flg.children(".p1").children(".date").text(data[i].date+" "+data[i].time);
						$flg.children(".p2").children(".label.label-default.zt").text(data[i].topic);
						$flg.children(".p2").children(".label.label-default.zt").css("background-color",topicColor(data[i].topic));
						if(topicColor(data[i].topic)=="#fff500"){$flg.children(".p2").children(".label.label-default.zt").css("color","gray");}
						if(data[i].quest==0){$flg.children(".p2").children(".label.label-default.yw").text("");}
						else{$flg.children(".p2").children(".label.label-default.yw").text("疑问");}
						if(data[i].suggest==0){$flg.children(".p2").children(".label.label-default.jy").text("");}
						else{$flg.children(".p2").children(".label.label-default.jy").text("建议");}
						if(data[i].sure==0){$flg.children(".p2").children(".label.label-default.kd").text("");}
						else{$flg.children(".p2").children(".label.label-default.kd").text("肯定");}
						if(data[i].attent==0){$flg.children(".p2").children(".label.label-default.gz").text("");}
						else{$flg.children(".p2").children(".label.label-default.gz").text("高关注度");}
						$flg.children(".text").text(data[i].text);
						$para = $flg.clone();//克隆节点
						$node.after($para);//兄弟关系的添加
						$node = $para;		
					}	
				}
				$parent.find("#frame5").contents().find(".term").first().remove();
				});
			})
	})
}