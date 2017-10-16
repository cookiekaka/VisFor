document.write("<script type='text/javascript' src='questSmall.js'></script>");
function svgRemove(){
	var remove = d3.select("svg");
	remove.remove();
}

function discussView(file){
	d3.json("../data/discuss.json", function(error, dAta){
		var daTa = dAta.topic;
		topicColor = d3.scale.ordinal()//主题标签的颜色比例尺
						.domain(daTa.map(function(d){ return d.name;}))
						.range(["#f09ba0","#fff500","#667bb4","#e8a000"]);
	})
	d3.json(file, function(error, dAta){
	var data = dAta.topic;
	//console.log(data);
	var w=window.innerWidth//浏览器窗口的宽度
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

	var h=window.innerHeight//浏览器窗口的高度
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;

	var width = (w-30)*0.98;//绘制画板
	var height = h*0.8;
	var pic1Width = width*0.22;
	var pic2Width = width*1.4;
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	var svg1 = svg.append("svg")//左图画板
					.attr("width", pic1Width)
					.attr("height", height);
	var svg2 = svg.append("svg")//右图画板
				.attr("width", pic2Width)
				.attr("height", height)
				.attr("transform", "translate("+pic1Width+", 0)");
	var padding = {top: 25, bottom: 0, right: 10, left: 30};//top不能变，其它最好不要变
//////////////////////////////////////////////////////////////////////////////////////////////////////////////svg1
	//step1：处理数据
	var stack = d3.layout.stack()//创建堆栈图布局
					.values(function(d){ return d.topic; })
					.x(function(d){ return d.date; })
					.y(function(d){ return d.discussion; })
					.offset("silhouette");//设定堆叠算法
	var dataStack = stack(data);//转换数据
	//console.log(data);
	//step2：定义比例尺和坐标
	//var tick2 = (pic2Width-svg2left-svg2right)/data.length;//x轴的刻度
	var xRangeWidth = pic1Width - padding.left - padding.right;
	var yRangeHeight = height - padding.top - padding.bottom;
	if(day==2){//点击7天按钮开始处理
		var weekArray = new Array();
		var n = data.length;
		var discussArray = new Array();
		var amount = 0;
		for(var i=0; i<data[0].topic.length; i++){
			if(i%6==0){
				weekArray.push(data[0].topic[i].date);
			}
			if((i==data[0].topic.length-1)&&i%6!=0){
				weekArray.push(data[0].topic[i].date);
			}
		}
		for(var j=0; j<data.length; j++){
			for(var k=0; k<data[j].topic.length; k++){
				amount += data[j].topic[k].discussion;
				if(k%6==0&&k!=0){
					discussArray.push(amount);
					amount = 0;
				}
				if((k==(data[j].topic.length-1))&&(k%6!=0)){
					discussArray.push(amount);
				}
			}
		}
		//console.log(discussArray)
		for(var m=0; m<data.length; m++){
			var p = data[m].topic.length - weekArray.length;
			data[m].topic.splice(weekArray.length,p);
			for(var n=0; n<weekArray.length; n++){
				data[m].topic[n].date = weekArray[n];
				if(n==0){
					data[m].topic[n].discussion = 0;
				}
				else{
					data[m].topic[n].discussion = discussArray[m*(weekArray.length-1)+n-1];
				}
			}
		}
		console.log(data);
		//stack(data);
	}
	
	var tick = (height-padding.top-padding.bottom-5)/data[0].topic.length;//y轴的刻度的长度,其中5为x轴的高度
	var tickX = tick+20;
	var yScale = d3.scale.ordinal()//创建y轴序数比例尺
				.domain(data[0].topic.map(function(d){ return d.date; }))//返回第一个对象的孩子的date遍历
				.rangePoints([0, height-padding.top-padding.bottom-tick]);
				
	var maxdiscussion = d3.max(data[data.length-1].topic, function(d){ return d.y + d.y0; });//最后一个对象的孩子的（起始点坐标+高度）的最大值，即为所有的点在y轴的最大值
	var xScale = d3.scale.linear()//创建x轴线性比例尺
					.domain([0, maxdiscussion])
					.range([0, xRangeWidth]);
					
	var yAxis = d3.svg.axis()//x坐标轴
					.scale(yScale)
					.orient("right");

	var xAxis = d3.svg.axis()//y坐标轴
					.scale(xScale)
					.orient("bottom");

	if(file == "../data/discussSource.json"){
		var color1 = d3.scale.linear()//颜色比例尺
						.domain([10,100])
						.range(["#f13636","#0ec194"]);
	}
	else{
		color1 = d3.scale.ordinal()//颜色比例尺
						.domain(data.map(function(d){ return d.name;}))
						.range(["#f09ba0","#fff500","#667bb4","#e8a000"]);
	}

	//step3：绘制河流
	var area = d3.svg.area()//区域生成器
					.y(function(d){
						return yScale(d.date);
					})
					.x0(function(d){
						//console.log(xRangeWidth-xScale(d.y0));
						return xScale(d.y0);
					})
					.x1(function(d){
						//console.log(xRangeWidth-xScale(d.y+d.y0));
						return xScale(d.y+d.y0);
					})
					.interpolate("basis");
					
	for(var j=0; j<data.length; j++){//绘制区域
		//console.log(data[j].topic);
		svg1.append("path")
			.attr("d", area(data[j].topic))
			.attr("fill", function(d){
				return color1(data[j].name);
			})
			.attr("class", "area")
			.attr("transform","translate("+padding.left+","+(padding.top+tick/2)+")");
	}				

//	svg1.append("g")//为坐标轴创建的g元素，要放在其它g元素之后!!!!!!!!此时不绘制坐标轴
//		.attr("class", "axisY")
//		.attr("transform", "translate("+padding.left+", "+(padding.top+tick/2+5)+")")
//		.call(yAxis);

//	svg1.append("g")
//		.attr("class", "axisY")
//		.attr("transform", "translate("+padding.left+", "+(height-padding.bottom-tick/2-5)+")")
//		.call(xAxis);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////svg2
	//step1:创建比例尺，计算值域中的数据
	var yScale = d3.scale.ordinal()//日期比例尺，y轴
					.domain(data[0].topic.map(function(d){ return d.date}))
					.rangePoints([0, height-padding.top-padding.bottom-tick]);

	//console.log(data.length);
	var svg2left = 80+pic1Width;//svg2left是y轴文字所占宽度
	var svg2right = 10//svg2right是右边距
	var length = 0;
	var tickK = (tick+30)*(data.length-1);//x轴根据y轴的tick算出的长度，也就是默认的x轴长度
	if(tickK > (height-padding.top-padding.bottom-tick) && day == 1){//但x轴不能比y轴长
		var length = 13;
		if(file == "../data/discussSource.json"){
			tickX = (w*0.75-svg2left-svg2right-tick)/data.length;
			length = 9;
		}
		else{tickX = (pic2Width-svg2left-svg2right-tick)/data.length;}
	}
	if(tickK > (height-padding.top-padding.bottom-tick) && day == 2){
		var length = 13;
		if(file == "../data/discussSource.json"){
			tickX = (w*0.75-svg2left-svg2right-tick)/data.length;
			length = 16;
		}
		else{tickX = (pic2Width-svg2left-svg2right-tick*2.5)/data.length;}
	}
	var xArray = data.map(function(d){ return d.name;});
	//if(file=="../data/discussSource.json"){xArray.unshift(0);}
	var xScale = d3.scale.ordinal()//主题/成绩比例尺，x轴
					.domain(xArray)
					//让x和y轴坐标的刻度等长
					.rangePoints([0, (tickX+length)*(data.length-1)]);//tick后面加的length是留给图例色块的空间
	var yAxis = d3.svg.axis()//y坐标轴
					.scale(yScale)
					.orient("left");
					//.tickValues();
	var xAxis = d3.svg.axis()//x坐标轴
					.scale(xScale)
					.orient("top");

	//step2：绘制坐标轴
	if(file=="../data/discussSource.json"){
		svg2.append("text")
		.text("0")
		.attr("fill", "gray")
		.attr("font-size", "9px")
		.attr("transform", "translate("+(svg2left+5)+", "+(padding.top-8)+")");
	}
	svg2.append("g")//绘制y坐标轴
		.attr("class", "axisY")
		.attr("transform", "translate("+svg2left+", "+(padding.top+tick/2)+")")
		.call(yAxis);
	svg2.append("g")//绘制x坐标轴
		.attr("class", "axisX")
		.attr("transform", function(){
			if(file=="../data/discussSource.json"){return "translate("+(svg2left+tickX*1.7+length*1.5)+", "+(padding.top)+")"}
			else{return "translate("+(svg2left+tickX+length)+", "+(padding.top)+")"}
		})
		.call(xAxis);
	
	
	//step3：绘制串联气泡的虚线
	var topicCoordinate = new Array();//各主题对应x轴比例尺的坐标数组
	for(var m=0; m<data.length; m++){
		topicCoordinate.push(xScale(data[m].name));
	}
	//console.log(topicCoordinate);
	var dashed = svg2.append("g")
					.attr("pic2Width", "pic2Width-svg2left-svg2right")
					.attr("height", "height-padding.top-padding.bottom-tick")
					.attr("transform", "translate("+svg2left+", "+padding.top+")");

	dashed.selectAll("line")
					.data(topicCoordinate)
					.enter()
					.append("line")
					.attr("x1", function(d){
						return d+tickX+length;
					})
					.attr("y1", function(d){
						return tick/2;
					})
					.attr("x2", function(d){
						return d+tickX+length;
					})
					.attr("y2", function(d){
						return height-padding.top-padding.bottom-tick/2;
					})
					.attr("class", "dashed");

	//step4：绘制气泡
	var dataset = new Array();//将文件数据转为多维数组，这样"circle"才知道怎么绘制
	var circleSize = new Array();//存储所有阅读量的数据，找出其中的最大值
	for(var j=0; j<data.length; j++){
		for(var k=0; k<data[j].topic.length; k++){
			dataset.push([data[j].topic[k].date, data[j].topic[k].discussion, data[j].name, data[j].topic[k].json]);
			//console.log(data[j].topic[k].discussion);
			circleSize.push(data[j].topic[k].discussion);
		}
	}
	var max = d3.max(circleSize);//阅读量的最大值，
	var diameter = tick<tickX?tick:tickX;
	var circleScale = d3.scale.linear()//气泡大小与刻度有关的比例尺
						.domain([0, max])
						.range([0, (diameter+length)/2]);
					
	var circle = svg2.selectAll("circle")
					.data(dataset)
					.enter()
					.append("circle")
					.attr("fill", function(d){
						return color1(d[2]);
					})
					.attr("cx", function(d){
						return xScale(d[2])+svg2left+tickX+length;
					})
					.attr("cy", function(d){
						if(day==2){return yScale(d[0])+padding.top;}
						else{return yScale(d[0])+padding.top+tick/2;}
					})
					.attr("r", function(d){
						return circleScale(d[1]);
					});//圆的半径要用比例尺，与y轴的刻度长有关
	//step5：绘制图例
	var legend = svg2.selectAll("rect")
					.data(topicCoordinate)
					.enter()
					.append("rect")
					.attr("width", function(){
						if(file=="../data/discussSource.json"){return 0;}
						else return 10;
					})
					.attr("height", 10)
					.attr("x", function(d){
						if(file == "../data/discussSource.json"){
							return d+svg2left+tickX+length;
						}
						else{return d+svg2left+tickX-30+length;}//其中30是图例色块向左的偏移量
					})
					.attr("y", padding.top-18)//其中18是图例色块向上的偏移量
					.attr("fill", function(d){
						return color1(d);
					})
	
	var tooltip = d3.select("body")
					.append("div")
					.attr("class", "tooltip")
					.style("opacity", 0.0);
	circle.on("mouseover", function(d){
		//console.log(d);
			tooltip.html("讨论量："+d[1])//文字：日期+主题一的讨论量为……
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
		//多页面交互
		.on("click", function(d){
			//页面5的变化
			var dateArray = new Array();
			dateArray = data[0].topic.map(function(d){ return d.date; });//日期数组。功能：点击了7天按钮时，CSV文件中该周内的数据都能检测到
			//console.log("dateArray:"+dateArray);
			//$parent.find(".term").remove();这句话的响应太慢
			/*var frame5 = top.frames.frame5;
			var p = frame5.document.getElementsByTagName("body");
			var a = frame5.document.getElementsByClassName("term");
			var par = frame5.document.getElementById("termPar");
			console.log(par);
			var b = a[0];
			par.removeChild();par.appendChild(b);
			console.log(par);
			//par.removeChild(a);
			/*for(var k=1; k<a.length; k++){
				var child = a[k];
				//par = frame5.document.getElementsByClassName("termPar");
				console.log(a[k]);
				par.removeChild(child);
			}*/
			//var $one = $parent.find("#frame5").contents().find(".term");
			//console.log($one);
			//$node.remove($node.slice(1));console.log($node);
			//var $a = $node.first();
			//console.log($a.html());
			//$a.nextAll().remove();
			//console.log($a);
			//var child = a[1];
			//var parent = a[0];
			//parent.nextAll().remove();//删除子节点，留下一个类为term的节点用于克隆
			//打点的要将 删除子节点 改为 删除同胞节点！！！！！
			var $parent = $(window.parent.document);//用jQuery选择器选出来的，才会是jQuery变量
			var $node = $parent.find("#frame5").contents().find(".term");
			var $a = $node.first();
			$a.nextAll().remove();
			d3.csv("../data/text.csv", function(error, data){
				//var $parent = $(window.parent.document);
				var $node = $parent.find("#frame5").contents().find(".term");
				//console.log($node);
				var $para = "";
				var $flg = $node;
				//console.log($flg);
				for(var i=0; i<data.length; i++){//遍历data中的所有元素，并删选
					if(day==2){//点击了7天按钮
						for(var k=0; k<dateArray.length-1; k++){
							if(data[i].date>=dateArray[k]&&data[i].date<=dateArray[k+1]){
								data[i].date=dateArray[k+1];//本周的日期转为本周最后一天的日期
								break;
							}
						}
					}
					if((file=="../data/discuss.json"&&data[i].date==d[0]&&data[i].topic==d[2])||
					(file=="../data/discussSource.json"&&data[i].date==d[0]&&Math.ceil(data[i].score/10)*10==d[2])){//根据点击circle的属性删选数据data
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
				$parent.find("#frame5").contents().find(".term").first().remove();//第一个节点会被多余地复制显示，这一句可去除这个复制点
				//console.log("term类的个数："+$parent.find("#frame5").contents().find(".term").length);
			});
			//页面3的变化
			/*var $parent = $(window.parent.document);//页面1到父页面
			$parent.find("#frame3").contents().find("svg").remove();
			//创建一个新窗口
			console.log(d[3]);
			console.log($parent.find("#frame3").contents().find("svg"));
			var $sam = $parent.find("#frame3").contents().find(".sep1").clone();
			var $ss = $parent.find("#frame3").contents().find("#s");
			$ss.after($sam);
			var h = $parent.find("#frame3").height()*0.3;
			console.log(h);
			var json = d[3];
			var colorArray = ["red","#0193de","#00923f"];
			var title = d[0]+"有关"+d[2]+"的疑问/建议/肯定";
			console.log();
			var flag = "score";
			$sam.html("$sam可写");
			var paper = ".sep2";
			$sam.html(frameDraw());
			questView(paper,h,json,colorArray,title,flag);
			//document.getElementsByClassName("sep1").innerHTML = questView(".sep1",h*0.3,json,colorArray,title,flag);
			*/
			}//点击事件结束
		)
	})//读取文件函数 结束
	
}
