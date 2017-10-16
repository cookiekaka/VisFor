function svgRemove(){
	var remove = d3.selectAll("svg");
	remove.remove();
}
function attentView_new(json){
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
		console.log(nodes);
		console.log(links);
		//console.log(links[1].target.y);
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
				return "translate("+padding.left+"," +padding.top+ ")";//%%%%让各层置顶绘制%%%%
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
	});
}