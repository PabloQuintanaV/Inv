window.onload = function(){
document.forms['formId'].addEventListener('submit', (event) => {
	event.preventDefault();
	fetch(event.target.action, {
		method: 'POST',
		body: new URLSearchParams(new FormData(event.target)) // event.target is the form
	}).then((resp) => {
		console.log("resp:",resp);
		if(resp.redirected){ console.log("REDIRECT TO", resp.url); 
							 location.replace(resp.url);}
		else console.log("NO REDIRECT");
		return resp.json(); 
	}).then((body) => {
		console.log("body:",body);
		document.getElementsByClassName("loin")[0].innerHTML = body.respuesta;
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";
	}).catch((error) => {throw error;});
});
}
