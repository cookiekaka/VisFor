//绘制函数，变量分别为：画布，宽度，数据路径，颜色比例尺
function frameDraw(){
	var x = "body";
	var svg = d3.select(x)
				.append("svg")
				.attr("width", 100)
				.attr("height", 100);
	svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 50)
		.attr("height", 50)
		.attr("fill", "black");
}
function questView(paper,wid,json,colorArray,title, flag){
	console.log("questView函数执行");
	var width = wid;//绘制画板
	var height = width*1.3;
	var svg = d3.select("body")
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
					
		var nodes = partition.nodes(json);//转换数据
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
			})
}