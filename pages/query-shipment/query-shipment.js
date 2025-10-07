document.addEventListener("DOMContentLoaded", () => {
	const backToDashboardButton = document.getElementById(
		"backToDashboardButton"
	);
	const keysContainer = document.getElementById("keysContainer");
	const addKeyButton = document.getElementById("addKeyButton");
	const submitQueryButton = document.getElementById("submitQueryButton");
	const apiResponse = document.getElementById("apiResponse");

	let keyCount = 1;
	let lastApiData = null;
	let lastApiRaw = "";
	let lastViewMode = "receipt";

	backToDashboardButton.addEventListener("click", () => {
		window.location.href = "../dashboard/dashboard.html";
	});

	addKeyButton.addEventListener("click", () => {
		const newKeyDiv = document.createElement("div");
		newKeyDiv.className = "form-group";
		newKeyDiv.innerHTML = `
      <label for="key-${keyCount}">Anahtar</label>
      <input id="key-${keyCount}" type="text" placeholder="Anahtar">
      <button class="remove-key-btn" style="margin-left:8px;">Sil</button>
    `;
		newKeyDiv.querySelector(".remove-key-btn").onclick = () =>
			newKeyDiv.remove();
		keysContainer.appendChild(newKeyDiv);
		keyCount++;
	});

	submitQueryButton.addEventListener("click", async () => {
		const keys = Array.from(keysContainer.querySelectorAll("input"))
			.map((input) => input.value)
			.filter((value) => value);
		const keyType = document.getElementById("keyType").value;
		const addHistoricalData =
			document.getElementById("addHistoricalData").checked;
		const onlyTracking = document.getElementById("onlyTracking").checked;

		if (!keys.length || keyType === "") {
			alert("Lütfen tüm zorunlu alanları doldurun.");
			return;
		}

		const queryData = {
			keys,
			keyType: parseInt(keyType),
			addHistoricalData,
			onlyTracking,
		};

		try {
			const response = await fetch(
				"https://localhost:7224/api/shipment/query-shipment",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify(queryData),
				}
			);

			if (response.ok) {
				const data = await response.json();
				lastApiData = data;
				lastApiRaw = JSON.stringify(data, null, 2);
				showReceiptModal(data);
				showShowLastReceiptBtn();
				showToggleJsonBtn();
			} else {
				const error = await response.text();
				lastApiData = { error };
				lastApiRaw = error;
				showReceiptModal({ error });
				showShowLastReceiptBtn();
				showToggleJsonBtn();
			}
		} catch (error) {
			apiResponse.textContent = `Bir hata oluştu: ${error.message}`;
		}
	});

	function showShowLastReceiptBtn() {
		let btn = document.getElementById("showLastReceiptBtn");
		if (!btn) {
			btn = document.createElement("button");
			btn.id = "showLastReceiptBtn";
			btn.textContent = "Fişi Tekrar Göster";
			btn.onclick = () => {
				if (lastApiData) showReceiptModal(lastApiData);
			};
			const apiResponse = document.getElementById("apiResponse");
			apiResponse.parentNode.insertBefore(btn, apiResponse.nextSibling);
		}
		btn.style.display = "inline-block";
	}

	function renderDetailTable(detail) {
		if (!detail) return "";
		let html = '<table class="detail-table">';
		for (const [key, value] of Object.entries(detail)) {
			if (Array.isArray(value)) {
				html += `<tr><td><b>${key}</b></td><td>${
					value.length > 0
						? "<ul>" +
							value
								.map(
									(v) =>
										`<li>${
											typeof v === "object"
												? renderDetailTable(v)
												: v
										}</li>`
								)
								.join("") +
							"</ul>"
						: "-"
				}</td></tr>`;
			} else if (typeof value === "object" && value !== null) {
				html += `<tr><td><b>${key}</b></td><td>${renderDetailTable(
					value
				)}</td></tr>`;
			} else {
				html += `<tr><td><b>${key}</b></td><td>${
					value ?? "-"
				}</td></tr>`;
			}
		}
		html += "</table>";
		return html;
	}

	function showReceiptModal(apiData) {
		const modal = document.getElementById("shipmentReceiptModal");
		const content = document.getElementById("receiptContent");
		let html = "";
		let type = "success";
		let title = "Kargo Sorgulama Başarılı";
		let details = "";

		// Toggle butonunu modalda her zaman göster
		const toggleBtn = document.getElementById("toggleJsonBtn");
		if (toggleBtn) {
			toggleBtn.style.display = "inline-block";
			toggleBtn.textContent =
				lastViewMode === "receipt" ? "JSON Göster" : "Fiş Göster";
			toggleBtn.onclick = () => {
				if (lastViewMode === "receipt") {
					showJsonModal();
					toggleBtn.textContent = "Fiş Göster";
					lastViewMode = "json";
				} else {
					showReceiptModal(lastApiData);
					toggleBtn.textContent = "JSON Göster";
					lastViewMode = "receipt";
				}
			};
		}

		if (apiData.error) {
			type = "error";
			title = "Bir Hata Oluştu";
			details = `<div>${apiData.error}</div>`;
		} else if (apiData.ShippingDeliveryVO) {
			const vo = apiData.ShippingDeliveryVO;
			if (vo.outFlag === "0") {
				type = "success";
				title = "Kargo Sorgulama Başarılı";
				details = `
          <div class='receipt-detail-row'><b>Durum:</b> ${vo.outResult}</div>
          <div class='receipt-detail-row'><b>Kargo Adedi:</b> ${vo.count}</div>
          <div class='receipt-detail-row'><b>Gönderen Müşteri ID:</b> ${
				vo.senderCustId
			}</div>
          <div style='margin:10px 0 0 0;'><b>Kargo Listesi:</b></div>
          <div>
            ${vo.shippingDeliveryDetailVO
				.map(
					(item) => `
              <div class='shipment-detail-block'>
                <div class='shipment-detail-title'>Kargo Anahtarı: <b>${
					item.cargoKey ?? "-"
				}</b> | Fatura: <b>${item.invoiceKey ?? "-"}</b></div>
                <div class='shipment-detail-table'>${renderDetailTable(
					item
				)}</div>
                ${
					item.shippingDeliveryItemDetailVO
						? `<div class='shipment-detail-subtitle'>Teslimat Detayları</div><div class='shipment-detail-table'>${renderDetailTable(
								item.shippingDeliveryItemDetailVO
							)}</div>`
						: ""
				}
              </div>
            `
				)
				.join("")}
          </div>
        `;
			} else {
				type = "error";
				title = "Kargo Sorgulama Hatası";
				details = `<div class='receipt-detail-row'><b>Durum:</b> ${
					vo.outResult
				}</div>
          <div class='receipt-detail-row'><b>Kargo Adedi:</b> ${vo.count}</div>
          <div style='margin:10px 0 0 0;'><b>Kargo Listesi:</b></div>
          <div>
            ${vo.shippingDeliveryDetailVO
				.map(
					(item) => `
              <div class='shipment-detail-block'>
                <div class='shipment-detail-title'>Kargo Anahtarı: <b>${
					item.cargoKey ?? "-"
				}</b> | Fatura: <b>${item.invoiceKey ?? "-"}</b></div>
                <div class='shipment-detail-table'>${renderDetailTable(
					item
				)}</div>
              </div>
            `
				)
				.join("")}
          </div>
        `;
			}
		} else {
			type = "error";
			title = "Bilinmeyen Hata";
			details = `<div>${JSON.stringify(apiData)}</div>`;
		}

		html = `
      <div class="receipt ${type}">
        <div class="receipt-title">${title}</div>
        ${details}
      </div>
    `;
		content.innerHTML = html;
		modal.classList.remove("hidden");
		lastViewMode = "receipt";
	}

	function showToggleJsonBtn() {
		let btn = document.getElementById("toggleJsonBtn");
		if (!btn) {
			btn = document.createElement("button");
			btn.id = "toggleJsonBtn";
			btn.textContent = "JSON Göster";
			btn.onclick = () => {
				if (lastViewMode === "receipt") {
					showJsonModal();
					btn.style.display = "none";
					lastViewMode = "json";
				}
			};
			const apiResponse = document.getElementById("apiResponse");
			apiResponse.parentNode.insertBefore(btn, apiResponse.nextSibling);
		}
		btn.style.display =
			lastViewMode === "receipt" ? "inline-block" : "none";
	}
	function showJsonModal() {
		const modal = document.getElementById("shipmentReceiptModal");
		const content = document.getElementById("receiptContent");
		content.innerHTML = `<pre style='font-size:13px; background:#F8FAFC; color:#1E293B; border:1.5px solid #E5E7EB; padding:12px; max-width:100vw; overflow:auto;'>${lastApiRaw}</pre>`;
		modal.classList.remove("hidden");
		lastViewMode = "json";
		// Toggle butonunu güncelle
		const toggleBtn = document.getElementById("toggleJsonBtn");
		if (toggleBtn) {
			toggleBtn.style.display = "inline-block";
			toggleBtn.textContent = "Fiş Göster";
		}
	}

	document.querySelector(".close-modal").onclick = () => {
		document.getElementById("shipmentReceiptModal").classList.add("hidden");
	};
	window.onclick = function (event) {
		const modal = document.getElementById("shipmentReceiptModal");
		if (event.target === modal) {
			modal.classList.add("hidden");
		}
	};
	document.getElementById("printReceipt").onclick = () => {
		const printContents =
			document.getElementById("receiptContent").innerHTML;
		const win = window.open("", "", "width=600,height=700");
		win.document.write("<html><head><title>Kargo Fişi</title>");
		win.document.write('<link rel="stylesheet" href="query-shipment.css">');
		win.document.write("</head><body>" + printContents + "</body></html>");
		win.document.close();
		win.focus();
		win.print();
		win.close();
	};
	document.getElementById("openReceiptWindow").onclick = () => {
		const printContents =
			document.getElementById("receiptContent").innerHTML;
		const win = window.open("", "", "width=600,height=700");
		win.document.write("<html><head><title>Kargo Fişi</title>");
		win.document.write('<link rel="stylesheet" href="query-shipment.css">');
		win.document.write("</head><body>" + printContents + "</body></html>");
		win.document.close();
		win.focus();
	};
});
