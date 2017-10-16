function text(){
	d3.json("../data/discuss.json", function(error, dAta){
	var daTa = dAta.topic;
	topicColor = d3.scale.ordinal()//主题标签的颜色比例尺
					.domain(daTa.map(function(d){ return d.name;}))
					.range(["#f09ba0","#fff500","#667bb4","#e8a000"]);
	})
	d3.csv("../data/text.csv", function(error, data){
		//console.log(data.length);
		var $node = $(".term");
		//console.log($node);
		var $para = "";
		var $flg = $node;
		for(var i=0; i<data.length; i++){
			//console.log("第"+i+"次执行");
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
		$(".term").first().remove();//第一个节点会被多余地复制显示，这一句可去除这个复制点
		//console.log("term类的个数："+document.getElementsByClassName("term").length);
	});
}
