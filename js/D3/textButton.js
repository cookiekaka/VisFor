function ywClick(){
	var num = 0;
	var $a = $(".p2");
	//console.log($a.length);
	$a.map(function(){
		//console.log($(this));
		//console.log($(this).children(".yw").text());
		if($(this).children(".yw").text()==""){//没有疑问标签
			num++;
			//console.log(num);
		}
		if(num==$a.length){//避免没有疑问时，删除了所有文本
			alert("当前文本内容中不包含疑问标签，故删选请求无效");
			return;
		}
	})
	if(num!=$a.length){
		$a.map(function(){
			if($(this).children(".yw").text()==""){//没有疑问标签
				//console.log($(this).parent().html());
				$(this).parent().remove();
				//console.log("执行删除term节点");
			}
		})
	}

}
function jyClick(){
	var num = 0;
	var $a = $(".p2");
	$a.map(function(){
		if($(this).children(".jy").text()==""){//没有建议标签
			num++;
		}
		if(num==$a.length){//避免没有建议时，删除了所有文本
			alert("当前文本内容中不包含建议标签，故删选请求无效");
			return;
		}
	})
	if(num!=$a.length){
		$a.map(function(){
			if($(this).children(".jy").text()==""){//没有建议标签
				$(this).parent().remove();
			}
		})	
	}
}
function kdClick(){
	var num = 0;
	var $a = $(".p2");
	$a.map(function(){
		if($(this).children(".kd").text()==""){//没有肯定标签
			num++;
		}
		if(num==$a.length){//避免没有肯定时，删除了所有文本
			alert("当前文本内容中不包含肯定标签，故删选请求无效");
			return;
		}
	})
	if(num!=$a.length){
		$a.map(function(){
			if($(this).children(".kd").text()==""){//没有肯定标签
				$(this).parent().remove();
			}
		})	
	}
}
function gzClick(){
	var num = 0;
	var $a = $(".p2");
	$a.map(function(){
		if($(this).children(".gz").text()==""){//没有关注标签
			num++;
		}
		if(num==$a.length){//避免没有关注时，删除了所有文本
			alert("当前文本内容中不包含关注标签，故删选请求无效");
			return;
		}
	})
	if(num!=$a.length){
		$a.map(function(){
			if($(this).children(".gz").text()==""){//没有关注标签
				$(this).parent().remove();
				}
		})	
	}
}