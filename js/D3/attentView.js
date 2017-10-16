function svgRemove(){
	var remove = d3.selectAll("svg");
	remove.remove();
}
function attentView(json){
	d3.json("../data/discuss.json", function(error, dAta){
	var daTa = dAta.topic;
	topicColor = d3.scale.ordinal()//主题标签的颜色比例尺
					.domain(daTa.map(function(d){ return d.name;}))
					.range(["#f09ba0","#fff500","#667bb4","#e8a000"]);
	})
	var width = (w-30)*0.5;//绘制画板
	var height = h*0.8;
	var svg = d3.select(".attent")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
				//.append("g")//划重点，svg要封装到g元素中，translate才有效
				//.attr("transform", "translate(40, 0)");
	var padding = { top: 10, bottom: 10, left: 10, right: 10 };	

	var tree = d3.layout.tree()//创建树状图布局 
					.size([height-padding.top-padding.bottom, width-padding.left-padding.right-height*0.08])
					.separation(function(a, b){
						return (a.parent == b.parent ? 1 : 1);
					})
					.sort(d3.ascending);
	var rectHeight = height*0.04;//这是什么？

	d3.json(json, function(error, root){//为布局绑定数据，并在函数体内绘制
		var nodes = tree.nodes(root);
		var links = tree.links(nodes);
		//console.log(nodes);
		//console.log(links);
		//console.log(links[1].target.y);

		//%%%%%%开始绘制连接区域%%%%%%
		var source = new Array();//计算同一source中每个target前面节点所占的长度
		var sourceName = "";
		var stick = new Array();//为将图形置顶，每个连接区域都需上移，stick数组存储每一层级上移的相同长度。
		var depth = -1;
		var targetStick = 0;
		var sourceStick = 0;
		for(var i=0; i<links.length; i++){
			if(links[i].source.name!=sourceName){//当source对象改变时（由于links元素是随source对象成组依次出现的，因此可按顺序来打组）
				sourceName=links[i].source.name;//标记source的name
				source.push(0);//每一个source对象的第一个之前是没有上一个子节点的
				var targetValue=0;
			}
			else{
				targetValue+=links[i-1].target.value*rectHeight;//同一个source对象下，前面所有子节点所占的长度
				source.push(targetValue);
			}
			if(links[i].source.depth>depth){//当depth改变时
				depth = links[i].source.depth;//标记depth
				targetStick = links[i].target.x;//本层衔接target的点要上移的长度
				sourceStick = links[i].source.x;//本层衔接source的点要上移的长度
			}
			stick.push([sourceStick, targetStick]);//stick[i][0]和stick[i][1]分别存储本层衔接target和source的点要上移的长度
		}
		//console.log(source);
		//console.log(stick);
		var areaPath = d3.svg.area()//创建区域生成器
							.y(function(d,i){return d[0];})//修改格式
							.x1(function(d,i){return d[2];})
							.x0(function(d,i){return d[1];});

		for(var i=0; i<links.length; i++){
			var area = new Array(5);
			area[0]=[links[i].target.x-links[i].target.value*rectHeight/2+(links[i].source.value*rectHeight/2-stick[i][0]), links[i].source.y+width/33, links[i].source.y+width/33];
			area[1]=[links[i].source.x-links[i].source.value*rectHeight/2+source[i]+(links[i].source.value*rectHeight/2-stick[i][0]), links[i].source.y+width/33, links[i].source.y+width/33];
			area[2]=[links[i].target.x-links[i].target.value*rectHeight/2+(links[i].target.value*rectHeight/2-stick[i][1]), links[i].target.y, links[i].source.y+width/33];
			area[3]=[links[i].target.x+links[i].target.value*rectHeight/2+(links[i].target.value*rectHeight/2-stick[i][1]), links[i].target.y, links[i].source.y+width/33];
			area[4]=[links[i].source.x-links[i].source.value*rectHeight/2+source[i]+links[i].target.value*rectHeight+(links[i].source.value*rectHeight/2-stick[i][0]), links[i].source.y+width/33, links[i].source.y+width/33];
			//console.log(area);
			svg.append("path")//绘制区域生成器
				.attr("d", areaPath(area)) 
				//.attr("stroke", "black")
				.attr("fill", "#f1f9ee")
				.attr("transform", "translate("+padding.left+", "+padding.top+")");
		}

		//%%%%%%连接区域绘制结束%%%%%%	
		var gNode = svg.selectAll(".node")//创建g元素
						.data(nodes)
						.enter()
						.append("g")
						.attr("class", "node")
						.attr("transform", function(d){
							return "translate(" + d.y + "," + d.x + ")";
						});
						
		var opacityColor = d3.scale.linear()//%%%%节点随层次透明度有变化%%%%
						.domain([0, nodes[nodes.length-1].depth])
						.range([1, 0.8]);

		gNode.append("rect")//绘制矩形节点
			.attr("transform", function(d){
				return "translate("+padding.left+"," + (padding.top+(-nodes[d.depth].x)) + ")";//%%%%让各层置顶绘制%%%%
			})
			.attr("width", width/33+"px")//%%%%柱形的宽度与画板宽度有关%%%%
			.attr("height", function(d){
				return d.value*rectHeight+"px";//%%%%关注度的值乘以rectHeight倍的像素。rectHeight为权重，最大关注度在rectHeight左右才合适%%%%
			})
			.attr("fill", "#006c9a")
			.style("fill-opacity", function(d){
				return opacityColor(d.depth);
			});
			
		gNode.append("text")//绘制节点文本
			.attr("transform", function(d){
				var s = d.depth;
				return "translate("+padding.left+"," + ((-nodes[s].x) + d.value*rectHeight + padding.top)+ ")";//让各层置顶绘制
			})
			.attr("dx", width/33+5)//%%%%文字相对柱形的位置，与柱形的宽度有关%%%%
			.style("text-anchor", "start")
			.text(function(d){
				return d.value;
			});
		gNode.on("click", function(d){
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
		var tooltip = d3.select("body")
						.append("div")
						.attr("class", "tooltip")
						.style("opacity", 0.0);
		gNode.on("mouseover", function(d){
				tooltip.html(function(){
					return "关于数组初始化的几个方法，老师讲的十分详细。";
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
	});
}