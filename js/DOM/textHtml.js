var w=window.innerWidth//浏览器窗口的宽度
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h=window.innerHeight//浏览器窗口的高度
|| document.documentElement.clientHeight
|| document.body.clientHeight;
text();
//添加主题标签
d3.json("../data/discuss.json", function(error, dAta){
	var daTa = dAta.topic;
	console.log();
	var topicName = daTa.map(function(d){ return d.name;})//没有var，就是全局变量
	topicColor = d3.scale.ordinal()//主题标签的颜色比例尺
					.domain(daTa.map(function(d){ return d.name;}))
					.range(["#f09ba0","#fff500","#667bb4","#e8a000"]);
	
	$(".topic").text(topicName[0]);
	$(".topic").css("background-color", "#f09ba0");
	$(".topic").css("color", "white");
	$(".topic").click(function(d){
	var name = this.innerHTML;
	var num = 0;
	var $a = $(".p2");
	$a.map(function(){
		if($(this).children(".zt").text()!=name){//没有主题*标签
			num++;
		}
		if(num==$a.length){//避免没有主题*时，删除了所有文本
			alert("当前文本内容中不包含"+name+"标签，故删选请求无效");
			return;
		}
	})
	if(num!=$a.length){
		$a.map(function(){
		if($(this).children(".zt").text()!=name){//没有主题*标签
			$(this).parent().remove();
			}
		})
	}
	})
	var $node = $(".topic");
	var $flg = $node;
	var $para = "";
	for(var i=1; i<topicName.length; i++){
		$para = $flg.clone();
		$para.text(topicName[i]);
		$para.css("background-color", topicColor(topicName[i]));
		if(topicColor(topicName[i])=="#fff500"){
			$para.css("color", "gray");
		}
		else{
			$para.css("color", "white");
		}
		$para.click(function(d){
			var name = this.innerHTML;
			var num = 0;
			var $a = $(".p2");
			$a.map(function(){
				if($(this).children(".zt").text()!=name){//没有主题*标签
					num++;
				}
				if(num==$a.length){//避免没有主题*时，删除了所有文本
					alert("当前文本内容中不包含"+name+"标签，故删选请求无效");
					return;
				}
			})
			if(num!=$a.length){
				$a.map(function(){
				if($(this).children(".zt").text()!=name){//没有主题*标签
					$(this).parent().remove();
					}
				})
			}
		})
		//console.log(topicColor(topicName[i]));
		$node.after($para);
		$node = $para;
	}
})
function backClick(){
	var $node = $(".term");
	var $a = $node.first();
	$a.nextAll().remove();
	text();
}