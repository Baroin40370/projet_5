
const orderId = new URL(location.href).searchParams.get('orderId');
document.getElementById('orderId').innerText = orderId;
	