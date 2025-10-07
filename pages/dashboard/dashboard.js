document.addEventListener("DOMContentLoaded", () => {
	const backToMainButton = document.getElementById("backToMainButton");
	const userInfoLabel = document.getElementById("userInfoLabel");
	const createShipmentButton = document.getElementById(
		"createShipmentButton"
	);
	const queryShipmentButton = document.getElementById("queryShipmentButton");
	const cancelShipmentButton = document.getElementById(
		"cancelShipmentButton"
	);

	// Kullanıcı bilgisini yükle
	loadUserInfo();

	backToMainButton.addEventListener("click", () => {
		window.location.href = "../../index.html";
	});
	createShipmentButton.addEventListener("click", () => {
		window.location.href = "../create-shipment/create-shipment.html";
	});
	queryShipmentButton.addEventListener("click", () => {
		window.location.href = "../query-shipment/query-shipment.html";
	});
	cancelShipmentButton.addEventListener("click", () => {
		window.location.href = "../cancel-shipment/cancel-shipment.html";
	});

	async function loadUserInfo() {
		// Önce sessionStorage'dan kontrol et
		const userType = sessionStorage.getItem("userType");
		if (!userType) {
			window.location.href = "index.html";
			return;
		}
		try {
			const response = await fetch(
				"https://localhost:7224/api/auth/current",
				{
					headers: { Accept: "application/json" },
				}
			);
			if (response.ok) {
				const data = await response.json();
				userInfoLabel.textContent = `Kullanıcı Türü: ${data.userType}`;
			} else {
				sessionStorage.removeItem("userType");
				window.location.href = "index.html";
			}
		} catch (error) {
			sessionStorage.removeItem("userType");
			window.location.href = "index.html";
		}
	}
});
