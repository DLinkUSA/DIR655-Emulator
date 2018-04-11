// JavaScript Document
function toggle_adv_dns(){
	if(document.getElementById('open_dns_enabled_select').checked){
		document.getElementById("wan_primary_dns").value="204.194.232.200";
		document.getElementById("wan_secondary_dns").value="204.194.234.200";
	}
	else{
		document.getElementById("wan_primary_dns").value="0.0.0.0";
		document.getElementById("wan_secondary_dns").value="0.0.0.0";
	}
}