function svgRemove(){
	var remove = d3.select("svg");
	remove.remove();
}

function scoreView(file){
	d3.json("../data/discuss.json", function(error, dAta){
		var daTa = dAta.topic;
		topicName = daTa.map(function(d){ return d.name;})//没有var，就是全局变量
		topicColor = d3.scale.ordinal()//主题标签的颜色比例尺
						.domain(daTa.map(function(d){ return d.name;}))
						.range(["#f09ba0","#fff500","#667bb4","#e8a000"]);
	})
	var w=window.innerWidth//浏览器窗口的宽度
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

	var h=window.innerHeight//浏览器窗口的高度
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;

	var width = (w-30)*0.97//绘制画板
	var height = h*0.79;
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	var padding = {top: 20, bottom: 10, right: 20, left: 70};

	d3.json(file, function(error, data){
	//console.log(data);
	//console.log(data.children[0].children.map(function(d){return d.score; }));
	//step1：创建比例尺
	var tick = (height-padding.top-padding.bottom)/data.children.length;//y轴刻度
	//点击7天按钮开始处理
	if(time == "week"){
		var weekArray = new Array();
		var n = data.children.length;
		var scoreArray = new Array();
		var q = 0;
		var sumNum = data.children[0].children[0].topic.length;//3或4
		var s=sumNum;
		var sum = new Array(sumNum);//每周各成绩段（10个）各类型的讨论量综合
		//console.log(data.children.length);
		for(var i=0; i<data.children.length; i++){
			if(i%6==0){
				weekArray.push(data.children[i].date);
				
			}
			if((i==data.children.length-1)&&i%6!=0){
				weekArray.push(data.children[i].date);
			}
		}
		//console.log("周数组:"+weekArray);	
		for(var j=0; j<weekArray.length-1; j++){//循环周的个数
			if(data.children.length-j*7>=0){q = 7;}
			else{q = data.children.length%7;}
			//console.log("q="+q);
			for(var k=0; k<data.children[0].children.length; k++){//循环10次，即成绩段数
				s=sumNum;
				while(s--){sum[s] = 0;}//sum初始化为0
				for(var p=0; p<sumNum; p++){//循环3,4次
					for(var r=0; r<q; r++){//循环7次或零头次，即q次
						sum[p] += data.children[j*7+r].children[k].topic[p];
						//console.log("r:"+r);
						if(r==q-1){scoreArray.push(sum[p]);}//if本次循环结束时，另amount是3维或4维数组
					}
				}
			}
			
		}
		//console.log("循环次数"+data.children[0].children.length);
		//console.log(scoreArray);
		var p = data.children.length - weekArray.length;
		data.children.splice(weekArray.length,p);
		//console.log("裁剪后的数组长度："+data.children.length);
		//console.log(weekArray);
		for(var m=0; m<data.children.length; m++){
			data.children[m].date = weekArray[m];
			//console.log(m);
			//console.log(data.children[m].children.length);
			for(var n=0; n<data.children[m].children.length; n++){//执行10循环
				//console.log((n+1)*10+"分数段");
				for(var x=0; x<sumNum; x++){
					if(m==0){
						data.children[m].children[n].topic[x] = 0;//data的第一个对象里的值都为0
					}
					else{
						data.children[m].children[n].topic[x] = scoreArray[(m-1)*10+n*sumNum+x];
						//console.log(data.children[m].children[n].topic[x]);
					}
				}
			}
		}
		//console.log(data.children);
		tick = (height-padding.top-padding.bottom)/(data.children.length-1);//y轴刻度
	}
	//点击7天按钮处理结束
	
	var yArray = data.children.map(function(d){return d.date; });
	var yArrayT = data.children.map(function(d){return d.date; });
	var xArray = data.children[0].children.map(function(d){return d.score; });
	if(time == "day"){
		yArray.unshift("");
	}
	xArray.unshift(0);//添加0点//0,10,20,30,40,50,60,70,80,90,100
	//console.log("xArray:"+xArray);
	//console.log("data长度："+data.children.length);
	var yScaleArray = new Array();
	if(time == "day"){
		yScaleArray = [0, tick*data.children.length];
	}
	else{
		yScaleArray = [0, tick*(data.children.length-1)];
		}
	var yScale = d3.scale.ordinal()//y轴比例尺，日期
					.domain(yArray)
					.rangePoints(yScaleArray);
	//console.log(yScaleArray);
	//console.log("yArray:"+yArray);
	var yScaleInvert = d3.scale.quantize()//y轴比例尺的反函数
						.domain(yScaleArray)
						.range(yArray);
	var xScale = d3.scale.ordinal()//x轴比例尺，成绩
					.domain(xArray)
					.rangePoints([0, width-padding.left-padding.right]);
	var xScaleInvert = d3.scale.quantize()//x轴比例尺的反函数
						.domain([0, width-padding.left-padding.right])
						.range(xArray);
	var yAxis = d3.svg.axis()//y坐标轴
					.scale(yScale)
					.orient("left");
					//.tickValues();
	var xAxis = d3.svg.axis()//x坐标轴
					.scale(xScale)
					.orient("top");
	//step2：绘制坐标轴
	if(time == "day"){
		var y1 = svg.append("g")//绘制y坐标轴，有线没子
				.attr("class", "axisY1")
				.attr("transform", "translate("+padding.left+", "+padding.top+")")
				.call(yAxis);
		var y2 = svg.append("g")//绘制y坐标轴，有字没线
				.attr("class", "axisY2")
				.attr("transform", "translate("+padding.left+", "+(padding.top-tick/2)+")")
				.call(yAxis);
	}
	else{
		var y2 = svg.append("g")//绘制y坐标轴，有字没线
				.attr("class", "axis")
				.attr("transform", "translate("+padding.left+", "+padding.top+")")
				.call(yAxis);
	}
	
	
	svg.append("g")//绘制x坐标轴
		.attr("class", "axis")
		.attr("transform", "translate("+padding.left+", "+padding.top+")")
		.call(xAxis);
	//step3：绘制虚线
	var scoreCoordinate = new Array();
	for(var i=1; i<xArray.length; i++){
		scoreCoordinate.push(xScale(xArray[i]));
	}
	//console.log(scoreCoordinate);
	var dateCoordinate = new Array();
	for(var i=1; i<yArray.length; i++){
		dateCoordinate.push(yScale(yArray[i]));
	}
	//console.log(dateCoordinate);
	var dashedY = svg.append("g")
					.attr("width", "width-padding.left-padding.right")
					.attr("height", "tick*data.children.length")
					.attr("transform", "translate("+padding.left+", "+padding.top+")");
	dashedY.selectAll("line")
					.data(scoreCoordinate)
					.enter()
					.append("line")
					.attr("x1", function(d){
						return d;
					})
					.attr("y1", 0)
					.attr("x2", function(d){
						return d;
					})
					.attr("y2", tick*data.children.length)
					.attr("class", "dashed");
	var dashedX = svg.append("g")
					.attr("width", "width-padding.left-padding.right")
					.attr("height", "tick*(data.children.length-1")
					.attr("transform", "translate("+padding.left+", "+padding.top+")");
	dashedX.selectAll("line")
					.data(dateCoordinate)
					.enter()
					.append("line")
					.attr("y1", function(d){
						return d;
					})
					.attr("x1", 0)
					.attr("y2", function(d){
						return d;
					})
					.attr("x2", width-padding.left-padding.right)
					.attr("class", "dashed");
	//step4：生成直方图数据
	yArray.shift();
	xArray.shift();
	//console.log("yArray:"+yArray);
	var dataset = new Array();
	if(time == "day"){
		for(var m=0; m<yArray.length; m++){//创建直方图数组
			for(var n=0; n<xArray.length; n++){
				var dataPara = new Array();
				for(var r=0; r<data.children[m].children[n].topic.length; r++){
					
					dataPara.push([data.children[m].children[n].topic[r], data.children[m].children[n].score,
									data.children[m].date]);
				}
				dataset.push(dataPara);
			}
		}
	}
	else{
		for(var m=0; m<yArray.length; m++){//创建直方图数组
			for(var n=0; n<xArray.length; n++){
				var dataPara = new Array();
				for(var r=0; r<data.children[m+1].children[n].topic.length; r++){
					dataPara.push([data.children[m+1].children[n].topic[r], data.children[m+1].children[n].score,
									data.children[m+1].date]);
				}
				dataset.push(dataPara);
			}
		}
	}
	//console.log(dataset);
	var min = d3.min(dataset, function(d, i){ return d3.min(d.map(function(d){ return d[0];})); });
	var max = d3.max(dataset, function(d){ return d3.max(d.map(function(d){ return d[0];})); });
	//console.log("最小值："+min);
	//console.log("最大值："+max);
	//step5：绘制直方图
	var tickx = (width-padding.left-padding.right)/10;
	var rectH;
	if(turn == "horizontal"){
			rectH = 0.9*tick-5;
		
	}
	else{
			rectH = 0.9*tickx-5;
	}
	var rScale = d3.scale.linear()//直方图高度比例尺
					.domain([0,max])
					.range([5,rectH]);
	var colorArray = "";
	var topicNum = data.children[0].children[0].topic.length;//主题个数，用于指定直方图的规模
	if(flag == "talkClass"){
		colorArray = ["red","#0193de","#00923f"];
		topicNum = data.children[0].children[0].topic.length;
		var colorClass = d3.scale.ordinal()//颜色反比例尺
							.domain(colorArray)
							.range(["quest","suggest","sure"]);
	}
	else{
		colorArray = ["#f09ba0","#fff500","#667bb4","#e8a000"];
		topicNum = data.children[0].children[0].topic.length;
		var colorTopic = d3.scale.ordinal()//颜色反比例尺
							.domain(colorArray)
							.range(topicName);//主题的名称数组
	}
	var color = d3.scale.ordinal()//颜色比例尺
						.domain([0,1,2,3])
						.range(colorArray);
	var rectWidth = 0.9/topicNum;//0.9为g元素边长减去内边距长度
	
	//绘制矩形
	//console.log("data长度："+data.children.length);
	//console.log(dataset);//二维数组，4*10的数组
	var rect = svg.append("g")
					.attr("width", width-padding.left-padding.right)
					.attr("height", function(){
						if(time == "day"){return tick*(data.children.length);}
						else{return tick*(data.children.length-1);}
					})
					.attr("transform", "translate("+padding.left+", "+padding.top+")");
	for(var j=0; j<dataset.length; j++){//每个正方形循环一次
		var n = parseInt(j/10);
		var m = j%10;
		//console.log(dataset[j]);
		var gRect = rect.append("g")//封装每个直方图的g元素
						.attr("width", tickx)
						.attr("height", tick)
						.attr("transform", function(d){
							return "translate("+(tickx*m)+","+(tick*n)+")";
						})
						.selectAll("rect")
						.data(dataset[j])//绑定柱形的数据
						.enter()
						.append("rect")
						.attr("fill", function(d, i){ return color(i);});
		if(turn == "horizontal"){
			gRect.attr("x", function(d, i){ return (0.05+rectWidth*i)*tickx; })//0.05为g元素的内边距
					.attr("y", function(d){ return tick*0.95-rScale(d[0]); })
					.attr("width", tickx*rectWidth)
					.attr("height", function(d){ return rScale(d[0]);});
		}
		else{
			gRect.attr("y", function(d, i){
				//console.log(tick*0.05+rectWidth*i);
				return(0.05+rectWidth*i)*tick; })//0.05为g元素的内边距
					.attr("x", function(d, i){ return tickx*0.05; })
					.attr("height", tick*rectWidth)
					.attr("width", function(d){ return rScale(d[0]);});
		}
		
	}
	//交互
	var tooltip = d3.select("body")
					.append("div")
					.attr("class", "tooltip")
					.style("opacity", 0.0);
	var focusLine = rect.append("g")
						.attr("class", "focusLine")
						.style("display", null);
	var line = focusLine.append("line")
						.attr("stroke", "gray")
						.attr("stroke-width",1);
	var rectD = 0;
	rect.selectAll("rect")//tooltip的交互
		.on("mouseover", function(d){
			rectD = d[0];
			tooltip.html("讨论量："+d[0])
						.style("left", (d3.event.pageX)+"px")
						.style("top", (d3.event.pageY+20)+"px")
						.style("opacity", 0.8);
		})
		.on("mouseout", function(d){
			tooltip.style("left", (d3.event.pageX)+"px")
					.style("top", (d3.event.pageY+20)+"px")
		})
		.on("mouseout", function(d){
			tooltip.style("opacity", 0.0);
		});
		//多页面交互
		rect.selectAll("rect")
			.on("click", function(d){
			//var dateArray = new Array();
			//console.log("yArray:"+yArray);
			console.log("柱形的属性"+d);//d[0]=讨论量，d[1]=分数区间，d[2]=时间(天)
			var circleColor = this.getAttribute('fill');//获取柱形的颜色
			//$parent.find(".term").remove();这句话的响应太慢
			var $parent = $(window.parent.document);//用jQuery选择器选出来的，才会是jQuery变量
			var $node = $parent.find("#frame5").contents().find(".term");
			var $a = $node.first();
			$a.nextAll().remove();
			d3.csv("../data/text.csv", function(error, data){
				var $node = $parent.find("#frame5").contents().find(".term");
				var $para = "";
				var $flg = $parent.find("#frame5").contents().find(".term");
				//console.log($node);
				for(var i=0; i<data.length; i++){//遍历数据，并删选
					if(time == "week"){//点击了7天按钮
					console.log(yArrayT);
						for(var k=0; k<yArrayT.length-1; k++){
							if(data[i].date>=yArrayT[k]&&data[i].date<=yArrayT[k+1]){
								data[i].date=yArrayT[k+1];//本周的日期转为本周最后一天的日期
								console.log(data[i].date);
								break;
							}
						}
					}
					//console.log("柱形的颜色:"+circleColor);
					if((flag=="topic"&&data[i].date==d[2]&&Math.ceil(data[i].score/10)*10==d[1]&&data[i].topic==colorTopic(circleColor))||
					(flag=="talkClass"&&data[i].date==d[2]&&Math.ceil(data[i].score/10)*10==d[1]&&data[i][colorClass(circleColor)]==1)){//根据点击circle的属性删选数据data
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
			});
			}//点击事件结束
		)
	rect.on("mouseover", function(d){//指示线的交互
			//console.log(this);
			if(turn == "horizontal"){
			var mouseY = d3.mouse(this)[1]-padding.top;
			var y0 = yScaleInvert(mouseY);//获取y轴上的值，时间
			//console.log(mouseY);
			//console.log("y0:"+y0);
			//console.log("rectD:"+rectD);
			for(var r=0; r<yArray.length; r++){
				if(y0==yArray[r]){var index = r;}
			}
			//console.log("index:"+index);
				line.style("display", null)//显示
					.attr("x1", 0)
					.attr("y1", function(d){ return tick*index+0.95*tick-rScale(rectD);})
					.attr("x2", width-padding.left-padding.right)
					.attr("y2", function(d){ return tick*index+0.95*tick-rScale(rectD);});
			}
			else{
				var mouseX = d3.mouse(this)[0]-padding.left;
				var x0 = xScaleInvert(mouseX);
				for(var q=0; q<xArray.length; q++){
					if(x0==xArray[q]){ index = q;}
				}
				//console.log(mouseX);
				//console.log("x0:"+x0);
				//console.log("rectD:"+rectD);
				//console.log("index:"+index);
				line.style("display", null)//显示
					.attr("y1", 0)
					.attr("x1", function(d){ return tickx*index+rScale(rectD)+0.05*tickx;})
					.attr("y2", tick*data.children.length)
					.attr("x2", function(d){ return tickx*index+rScale(rectD)+0.05*tickx;});
			}
		})
		.on("mouseout", function(d){
			line.style("display", "none");
		})
		.on("mouseout", function(d){
			line.style("display", "none");
		})
})
}
