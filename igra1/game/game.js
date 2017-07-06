$(document).ready(function(){
$("#btn1").on("click",function(){
	$.ajax(
	{
		url : "../../utils/dohvatiRezultat.php",
		data : { title : "Vremenska prognoza" },
		success: function(data)
		{
			$("#primjer1").html(data);
		},
		error: function(xhr, status)
		{
			if(status!==null) 
				console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
	});
});
});