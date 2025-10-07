document.addEventListener("DOMContentLoaded", () => {
	const loginTypePicker = document.getElementById("loginTypePicker");
	const loginTypeLabel = document.getElementById("loginTypeLabel");
	const usernameEntry = document.getElementById("usernameEntry");
	const passwordEntry = document.getElementById("passwordEntry");
	const loginButton = document.getElementById("loginButton");
	const backToMainButton = document.getElementById("backToMainButton");
	const userInfoLabel = document.getElementById("userInfoLabel");
	const createShipmentButton = document.getElementById(
		"createShipmentButton"
	);
	const queryShipmentButton = document.getElementById("queryShipmentButton");
	const cancelShipmentButton = document.getElementById(
		"cancelShipmentButton"
	);
	const mainPage = document.getElementById("main-page");

	// Get credentials from environment variables
	const credentials = window.electronAPI.getCredentials();

	loginTypePicker.addEventListener("change", (e) => {
		const selectedValue = e.target.value;
		if (selectedValue && selectedValue !== "") {
			loginTypeLabel.textContent = `${selectedValue} için Giriş Bilgilerini Giriniz`;
			switch (selectedValue) {
				case "Test":
					usernameEntry.value = credentials.TEST_USERNAME;
					passwordEntry.value = credentials.TEST_PASSWORD;
					break;
				case "GoNormal":
					usernameEntry.value = credentials.GONORMAL_USERNAME;
					passwordEntry.value = credentials.GONORMAL_PASSWORD;
					break;
				case "GoTahsilat":
					usernameEntry.value = credentials.GOTAHSILAT_USERNAME;
					passwordEntry.value = credentials.GOTAHSILAT_PASSWORD;
					break;
				case "AoNormal":
					usernameEntry.value = credentials.AONORMAL_USERNAME;
					passwordEntry.value = credentials.AONORMAL_PASSWORD;
					break;
				case "AoTahsilat":
					usernameEntry.value = credentials.AOTAHSILAT_USERNAME;
					passwordEntry.value = credentials.AOTAHSILAT_PASSWORD;
					break;
				default:
					usernameEntry.value = "";
					passwordEntry.value = "";
					break;
			}
		}
	});

	loginButton.addEventListener("click", async () => {
		const loginType = loginTypePicker.value;
		const username = usernameEntry.value;
		const password = passwordEntry.value;

		if (!loginType || !username || !password) {
			alert("Lütfen tüm alanları doldurun.");
			return;
		}

		try {
			const response = await fetch(
				"https://localhost:7224/api/auth/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({
						UserType: loginType,
						Username: username,
						Password: password,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				// Kullanıcı bilgisini sessionStorage'a kaydet
				sessionStorage.setItem("userType", data.userType);
				alert(
					`Giriş başarılı! Kullanıcı: ${data.userType}. Dashboard'a yönlendirileceksiniz.`
				);
				window.location.href = "./pages/dashboard/dashboard.html";
			} else {
				const error = await response.text();
				alert(`Giriş başarısız oldu: ${error}`);
			}
		} catch (error) {
			alert(`Bir hata oluştu: ${error.message}`);
		}
	});

	async function loadUserInfo() {
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
				userInfoLabel.textContent =
					"Kullanıcı bilgileri alınamadı. Tekrar giriş yapmayı deneyin.";
			}
		} catch (error) {
			alert(
				`Kullanıcı bilgileri alınırken bir hata oluştu: ${error.message}`
			);
		}
	}

	backToMainButton.addEventListener("click", () => {
		mainPage.classList.remove("hidden");
	});

	createShipmentButton.addEventListener("click", () => {
		window.location.href = "pages/create-shipment/create-shipment.html";
	});

	queryShipmentButton.addEventListener("click", () => {
		window.location.href = "pages/query-shipment/query-shipment.html";
	});

	cancelShipmentButton.addEventListener("click", () => {
		window.location.href = "pages/cancel-shipment/cancel-shipment.html";
	});
});
