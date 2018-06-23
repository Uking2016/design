
$(".small,.big").click(function(){					   
$(this).css("border","1px solid");						   
});
var lately;//用来存放最近一次被双击的元素
var n=0;//用来记录用户添加的图片数
var srcs=[];//用户上传图片的数组

$(".small,.big").dblclick(function(event){//用户双击div盒子上传图片					
lately=event.target;	//lately记录最近一次被双击的div，为上传图片之后，确定图片的位置
$("#upload").trigger("click");
});

$("#upload").change(function(){//当用户选择了要上传的图片时触发该函数
  var csrf=$(this).val();	
  var img=document.createElement("img");
  img.src=window.URL.createObjectURL($(this)[0].files[0]);
  srcs.push(img.src);//把用户上传的图片的路径放进一个数组
  img.id="img"+n;//给每一个图片设置一个id值，为了后来的拖放能够被识别
  n++;
  img.style.width=lately.clientWidth+"px";
  img.style.height=lately.clientHeight+"px";
  if(lately.tagName.toLowerCase()=="img"){lately=lately.parentNode;}
  if(lately.children.length<=0){//如果被双击的盒子已经有图片，那么用用户新上传的替换原来的图片
  lately.appendChild(img);
  $("#"+lately.id).css("border","none");//去掉双击时的边框
  }else{
	lately.replaceChild(img,lately.children[0]);  
  }
   img=img.cloneNode(true);//这里要克隆一张图片，是因为如果直接拖拉不克隆会导致存在盒子的图片消失。
   img.style.width=80+"px";
   img.style.height=80+"px";
   img.draggable=true;
   img.ondragstart=start;
   $("#picShow").append(img);
});
$("#userUp").click(function(){//为了美化原生的上传按钮，设置了一个普通的图片按钮
  $("#upload2").trigger("click");
});
$("#upload2").change(function(){
  var img=document.createElement("img");
  img.id="img"+n;
  n++;
  var src=$("#upload2")[0].value;
  img.src="../../design/images/ads/"+src;
  srcs.push(src);//把用户上传的图片的路径放进一个数组
  img.draggable=true;
  img.ondragstart=start;
  $("#picShow").append(img);
});

function start(e){
e.dataTransfer.setData("Text",e.target.id);	
e.dataTransfer.effectAllowed="all";
}
$(document).on("dragover",".small,.big",function(e){//用on绑定事件dragover
e.preventDefault();			
});
var smallDivs=document.getElementsByClassName("small");
var bigDivs=document.getElementsByClassName("big");

for(var i=0;i<smallDivs.length;i++){//小的div处理拖拉功能
smallDivs[i].ondrop=function(e){
e.preventDefault();	
var data=e.dataTransfer.getData("Text");
var ele=document.getElementById(data);
var tar=e.target;
if(e.target.tagName.toLowerCase()=="img"){
 tar=e.target.parentNode;
}
ele=ele.cloneNode(true);
ele.style.width=tar.offsetWidth+"px";
ele.style.height=tar.offsetHeight+"px";
if(tar.children.length<=0){
	
	tar.appendChild(ele);
	}else{

	tar.replaceChild(ele,tar.children[0]);	
		}
}
smallDivs[i].ondragenter=function(e){
e.dataTransfer.dropEffect="copy";	
smallDivs[i].ondragover=function(e){
	e.preventDefault();
 }
}
}

for(var i=0;i<bigDivs.length;i++){
bigDivs[i].ondrop=function(e){
e.preventDefault();	
var data=e.dataTransfer.getData("Text");
var ele=document.getElementById(data);
ele=ele.cloneNode(true);
var tar=e.target;
if(e.target.tagName.toLowerCase()=="img"){
 tar=e.target.parentNode;
}
ele.style.width=tar.offsetWidth+"px";
ele.style.height=tar.offsetHeight+"px";

if(tar.children.length<=0){
		tar.appendChild(ele);
	}else{
	
		tar.replaceChild(ele,tar.children[0]);	
		}
} 

bigDivs[i].ondragenter=function(e){
e.dataTransfer.dropEffect="copy";	
}
bigDivs[i].ondragover=function(e){
e.preventDefault();e.dataTransfer.dropEffect="copy";	
}
bigDivs[i].ondragover=function(e){
	e.preventDefault();
}

}

$("#fillInput").click(function(){//填充图片
    if(srcs.length>=0){
	  var img=document.createElement("img");
	  img.src=srcs[0];  
	  var width=$(".small").width();
	  var height=$(".small").height();
	  img.style.width=width+"px";
	  img.style.height=height+"px";
	  
	  for(var i=0;i<smallDivs.length;i++){
		  img=img.cloneNode(true);
		  if(smallDivs[i].children.length==0){   
			   smallDivs[i].appendChild(img);
			 }
	   }
    }
   if(srcs.length-1>=0){
   var img=document.createElement("img");
	  img.src=srcs[srcs.length-1];
	  var width=$(".big").width();
	  var height=$(".big").height();
	  img.style.width=width+"px";
	  img.style.height=height+"px";
        for(var i=0;i<bigDivs.length;i++){
		   img=img.cloneNode(true);
		  if(bigDivs[i].children.length==0){
			   bigDivs[i].appendChild(img);
			 }
		  }
   }
});
$("#saveInput").click(function(){//把设计的Div中各个div的位置信息，里面的图片信息读取，然后在canvas中描绘，最后通过toDataUrl函数导出一张图片
  var canvas=document.getElementById("canvas");
  var context=canvas.getContext("2d");
  for(var i=1;i<=23;i++){
	  var divi=document.getElementById("div"+i);
	  var img=new Image();
	  img.src=divi.children[0].src; 
	  var left=divi.offsetLeft;
	  var top=divi.offsetTop;
	  context.drawImage(img,left,top,50,50);  
  }		
 for(var i=1;i<=4;i++){
	  var divi=document.getElementById("big"+i);
	  var img=new Image();
	  img.src=divi.children[0].src; 
	  var left=divi.offsetLeft;
	  var top=divi.offsetTop;
	  context.drawImage(img,left,top,140,140);  
  }
  var imgUrl=canvas.toDataURL("image/png");
  var image=new Image();
  image.src=imgUrl;
  $("#finallyPic").append(image);
});
		