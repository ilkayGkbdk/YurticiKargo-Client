document.addEventListener("DOMContentLoaded", () => {
	const backToDashboardButton = document.getElementById(
		"backToDashboardButton"
	);
	const shipmentForms = document.getElementById("shipmentForms");
	const addShipmentButton = document.getElementById("addShipmentButton");
	const submitShipmentButton = document.getElementById(
		"submitShipmentButton"
	);

	let shipmentCount = 1;
	let lastApiData = null;
	let lastApiRaw = "";
	let lastViewMode = "receipt";

	backToDashboardButton.addEventListener("click", () => {
		window.location.href = "../dashboard/dashboard.html";
	});

	function createShipmentForm(shipmentId) {
		const formSection = document.createElement("div");
		formSection.className = "form-section";
		formSection.dataset.shipmentId = shipmentId;
		formSection.innerHTML = `
      <h2>Zorunlu Bilgiler</h2>
      <div class="form-group">
        <label for="cargoKey-${shipmentId}">Kargo Anahtarı</label>
        <input id="cargoKey-${shipmentId}" type="text" placeholder="Kargo Anahtarı">
      </div>
      <div class="form-group">
        <label for="invoiceKey-${shipmentId}">Fatura Anahtarı</label>
        <input id="invoiceKey-${shipmentId}" type="text" placeholder="Fatura Anahtarı">
      </div>
      <div class="form-group">
        <label for="receiverCustName-${shipmentId}">Alıcı Adı</label>
        <input id="receiverCustName-${shipmentId}" type="text" placeholder="Alıcı Adı">
      </div>
      <div class="form-group">
        <label for="receiverAddress-${shipmentId}">Alıcı Adresi</label>
        <input id="receiverAddress-${shipmentId}" type="text" placeholder="Alıcı Adresi">
      </div>
      <div class="form-group">
        <label for="receiverPhone1-${shipmentId}">Alıcı Telefon 1</label>
        <input id="receiverPhone1-${shipmentId}" type="text" placeholder="Alıcı Telefon 1">
      </div>
      <button class="toggle-optional-button" data-shipment-id="${shipmentId}">Opsiyonel Alanları Göster</button>
      <div class="optional-fields hidden" data-shipment-id="${shipmentId}">
        <div class="form-group">
          <label for="receiverPhone2-${shipmentId}">Alıcı Telefon 2</label>
          <input id="receiverPhone2-${shipmentId}" type="text" placeholder="Alıcı Telefon 2">
        </div>
        <div class="form-group">
          <label for="receiverPhone3-${shipmentId}">Alıcı Telefon 3</label>
          <input id="receiverPhone3-${shipmentId}" type="text" placeholder="Alıcı Telefon 3">
        </div>
        <div class="form-group">
          <label for="cityName-${shipmentId}">Şehir</label>
          <input id="cityName-${shipmentId}" type="text" placeholder="Şehir">
        </div>
        <div class="form-group">
          <label for="townName-${shipmentId}">İlçe</label>
          <input id="townName-${shipmentId}" type="text" placeholder="İlçe">
        </div>
        <div class="form-group">
          <label for="custProdId-${shipmentId}">Müşteri Ürün ID</label>
          <input id="custProdId-${shipmentId}" type="text" placeholder="Müşteri Ürün ID">
        </div>
        <div class="form-group">
          <label for="desi-${shipmentId}">Desi</label>
          <input id="desi-${shipmentId}" type="number" step="0.01" placeholder="Desi">
        </div>
        <div class="form-group">
          <label for="desiSpecified-${shipmentId}">Desi Belirtildi</label>
          <input id="desiSpecified-${shipmentId}" type="checkbox">
        </div>
        <div class="form-group">
          <label for="kg-${shipmentId}">Kg</label>
          <input id="kg-${shipmentId}" type="number" step="0.01" placeholder="Kg">
        </div>
        <div class="form-group">
          <label for="kgSpecified-${shipmentId}">Kg Belirtildi</label>
          <input id="kgSpecified-${shipmentId}" type="checkbox">
        </div>
        <div class="form-group">
          <label for="cargoCount-${shipmentId}">Kargo Sayısı</label>
          <input id="cargoCount-${shipmentId}" type="number" placeholder="Kargo Sayısı">
        </div>
        <div class="form-group">
          <label for="waybillNo-${shipmentId}">İrsaliye No</label>
          <input id="waybillNo-${shipmentId}" type="text" placeholder="İrsaliye No">
        </div>
        <div class="form-group">
          <label for="specialField1-${shipmentId}">Özel Alan 1</label>
          <input id="specialField1-${shipmentId}" type="text" placeholder="Özel Alan 1">
        </div>
        <div class="form-group">
          <label for="specialField2-${shipmentId}">Özel Alan 2</label>
          <input id="specialField2-${shipmentId}" type="text" placeholder="Özel Alan 2">
        </div>
        <div class="form-group">
          <label for="specialField3-${shipmentId}">Özel Alan 3</label>
          <input id="specialField3-${shipmentId}" type="text" placeholder="Özel Alan 3">
        </div>
        <div class="form-group">
          <label for="ttCollectionType-${shipmentId}">Tahsilat Türü</label>
          <input id="ttCollectionType-${shipmentId}" type="text" placeholder="Tahsilat Türü">
        </div>
        <div class="form-group">
          <label for="ttInvoiceAmount-${shipmentId}">Fatura Tutarı</label>
          <input id="ttInvoiceAmount-${shipmentId}" type="number" step="0.01" placeholder="Fatura Tutarı">
        </div>
        <div class="form-group">
          <label for="ttInvoiceAmountSpecified-${shipmentId}">Fatura Tutarı Belirtildi</label>
          <input id="ttInvoiceAmountSpecified-${shipmentId}" type="checkbox">
        </div>
        <div class="form-group">
          <label for="ttDocumentId-${shipmentId}">Belge ID</label>
          <input id="ttDocumentId-${shipmentId}" type="number" placeholder="Belge ID">
        </div>
        <div class="form-group">
          <label for="ttDocumentSaveType-${shipmentId}">Belge Kayıt Türü</label>
          <input id="ttDocumentSaveType-${shipmentId}" type="text" placeholder="Belge Kayıt Türü">
        </div>
        <div class="form-group">
          <label for="orgReceiverCustId-${shipmentId}">Orijinal Alıcı Müşteri ID</label>
          <input id="orgReceiverCustId-${shipmentId}" type="text" placeholder="Orijinal Alıcı Müşteri ID">
        </div>
        <div class="form-group">
          <label for="description-${shipmentId}">Açıklama</label>
          <input id="description-${shipmentId}" type="text" placeholder="Açıklama">
        </div>
        <div class="form-group">
          <label for="taxNumber-${shipmentId}">Vergi Numarası</label>
          <input id="taxNumber-${shipmentId}" type="text" placeholder="Vergi Numarası">
        </div>
        <div class="form-group">
          <label for="taxOfficeId-${shipmentId}">Vergi Dairesi ID</label>
          <input id="taxOfficeId-${shipmentId}" type="number" placeholder="Vergi Dairesi ID">
        </div>
        <div class="form-group">
          <label for="taxOfficeName-${shipmentId}">Vergi Dairesi Adı</label>
          <input id="taxOfficeName-${shipmentId}" type="text" placeholder="Vergi Dairesi Adı">
        </div>
        <div class="form-group">
          <label for="orgGeoCode-${shipmentId}">Orijinal Coğrafi Kod</label>
          <input id="orgGeoCode-${shipmentId}" type="text" placeholder="Orijinal Coğrafi Kod">
        </div>
        <div class="form-group">
          <label for="privilegeOrder-${shipmentId}">Öncelikli Sipariş</label>
          <input id="privilegeOrder-${shipmentId}" type="text" placeholder="Öncelikli Sipariş">
        </div>
        <div class="form-group">
          <label for="dcSelectedCredit-${shipmentId}">Seçilen Kredi</label>
          <input id="dcSelectedCredit-${shipmentId}" type="number" placeholder="Seçilen Kredi">
        </div>
        <div class="form-group">
          <label for="dcCreditRule-${shipmentId}">Kredi Kuralı</label>
          <input id="dcCreditRule-${shipmentId}" type="number" placeholder="Kredi Kuralı">
        </div>
        <div class="form-group">
          <label for="emailAddress-${shipmentId}">E-posta Adresi</label>
          <input id="emailAddress-${shipmentId}" type="email" placeholder="E-posta Adresi">
        </div>
      </div>
    `;
		// Sil butonu ekle
		if (shipmentId !== "0") {
			const removeBtn = document.createElement("button");
			removeBtn.className = "remove-shipment-btn";
			removeBtn.textContent = "Sil";
			removeBtn.style.marginLeft = "8px";
			removeBtn.onclick = () => formSection.remove();
			formSection.appendChild(removeBtn);
		}
		return formSection;
	}

	addShipmentButton.addEventListener("click", () => {
		const newForm = createShipmentForm(shipmentCount);
		shipmentForms.appendChild(newForm);
		const toggleButton = newForm.querySelector(".toggle-optional-button");
		toggleButton.addEventListener("click", () => {
			const optionalFields = newForm.querySelector(".optional-fields");
			optionalFields.classList.toggle("hidden");
			toggleButton.textContent = optionalFields.classList.contains(
				"hidden"
			)
				? "Opsiyonel Alanları Göster"
				: "Opsiyonel Alanları Gizle";
		});
		shipmentCount++;
	});

	document
		.querySelector(".toggle-optional-button")
		.addEventListener("click", () => {
			const optionalFields = document.querySelector(
				'.optional-fields[data-shipment-id="0"]'
			);
			optionalFields.classList.toggle("hidden");
			document.querySelector(
				'.toggle-optional-button[data-shipment-id="0"]'
			).textContent = optionalFields.classList.contains("hidden")
				? "Opsiyonel Alanları Göster"
				: "Opsiyonel Alanları Gizle";
		});

	submitShipmentButton.addEventListener("click", async () => {
		const shippingOrders = [];
		const formSections = shipmentForms.querySelectorAll(".form-section");

		formSections.forEach((section, index) => {
			const shipmentId = section.dataset.shipmentId;
			const shippingOrder = {
				cargoKey: document.getElementById(`cargoKey-${shipmentId}`)
					.value,
				invoiceKey: document.getElementById(`invoiceKey-${shipmentId}`)
					.value,
				receiverCustName: document.getElementById(
					`receiverCustName-${shipmentId}`
				).value,
				receiverAddress: document.getElementById(
					`receiverAddress-${shipmentId}`
				).value,
				receiverPhone1: document.getElementById(
					`receiverPhone1-${shipmentId}`
				).value,
				receiverPhone2:
					document.getElementById(`receiverPhone2-${shipmentId}`)
						.value || null,
				receiverPhone3:
					document.getElementById(`receiverPhone3-${shipmentId}`)
						.value || null,
				cityName:
					document.getElementById(`cityName-${shipmentId}`).value ||
					null,
				townName:
					document.getElementById(`townName-${shipmentId}`).value ||
					null,
				custProdId:
					document.getElementById(`custProdId-${shipmentId}`).value ||
					null,
				desi: document.getElementById(`desi-${shipmentId}`).value
					? parseFloat(
							document.getElementById(`desi-${shipmentId}`).value
						)
					: null,
				desiSpecified:
					document.getElementById(`desiSpecified-${shipmentId}`)
						.checked || null,
				kg: document.getElementById(`kg-${shipmentId}`).value
					? parseFloat(
							document.getElementById(`kg-${shipmentId}`).value
						)
					: null,
				kgSpecified:
					document.getElementById(`kgSpecified-${shipmentId}`)
						.checked || null,
				cargoCount: document.getElementById(`cargoCount-${shipmentId}`)
					.value
					? parseInt(
							document.getElementById(`cargoCount-${shipmentId}`)
								.value
						)
					: null,
				waybillNo:
					document.getElementById(`waybillNo-${shipmentId}`).value ||
					null,
				specialField1:
					document.getElementById(`specialField1-${shipmentId}`)
						.value || null,
				specialField2:
					document.getElementById(`specialField2-${shipmentId}`)
						.value || null,
				specialField3:
					document.getElementById(`specialField3-${shipmentId}`)
						.value || null,
				ttCollectionType:
					document.getElementById(`ttCollectionType-${shipmentId}`)
						.value || null,
				ttInvoiceAmount: document.getElementById(
					`ttInvoiceAmount-${shipmentId}`
				).value
					? parseFloat(
							document.getElementById(
								`ttInvoiceAmount-${shipmentId}`
							).value
						)
					: null,
				ttInvoiceAmountSpecified:
					document.getElementById(
						`ttInvoiceAmountSpecified-${shipmentId}`
					).checked || null,
				ttDocumentId: document.getElementById(
					`ttDocumentId-${shipmentId}`
				).value
					? parseInt(
							document.getElementById(
								`ttDocumentId-${shipmentId}`
							).value
						)
					: null,
				ttDocumentSaveType:
					document.getElementById(`ttDocumentSaveType-${shipmentId}`)
						.value || null,
				orgReceiverCustId:
					document.getElementById(`orgReceiverCustId-${shipmentId}`)
						.value || null,
				description:
					document.getElementById(`description-${shipmentId}`)
						.value || null,
				taxNumber:
					document.getElementById(`taxNumber-${shipmentId}`).value ||
					null,
				taxOfficeId: document.getElementById(
					`taxOfficeId-${shipmentId}`
				).value
					? parseInt(
							document.getElementById(`taxOfficeId-${shipmentId}`)
								.value
						)
					: null,
				taxOfficeName:
					document.getElementById(`taxOfficeName-${shipmentId}`)
						.value || null,
				orgGeoCode:
					document.getElementById(`orgGeoCode-${shipmentId}`).value ||
					null,
				privilegeOrder:
					document.getElementById(`privilegeOrder-${shipmentId}`)
						.value || null,
				dcSelectedCredit: document.getElementById(
					`dcSelectedCredit-${shipmentId}`
				).value
					? parseInt(
							document.getElementById(
								`dcSelectedCredit-${shipmentId}`
							).value
						)
					: null,
				dcCreditRule: document.getElementById(
					`dcCreditRule-${shipmentId}`
				).value
					? parseInt(
							document.getElementById(
								`dcCreditRule-${shipmentId}`
							).value
						)
					: null,
				emailAddress:
					document.getElementById(`emailAddress-${shipmentId}`)
						.value || null,
			};

			if (
				shippingOrder.cargoKey &&
				shippingOrder.invoiceKey &&
				shippingOrder.receiverCustName &&
				shippingOrder.receiverAddress &&
				shippingOrder.receiverPhone1
			) {
				shippingOrders.push(shippingOrder);
			}
		});

		if (shippingOrders.length === 0) {
			alert("Lütfen en az bir kargo için tüm zorunlu alanları doldurun.");
			return;
		}

		try {
			const response = await fetch(
				"https://localhost:7224/api/shipment/create-shipment",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({ shippingOrder: shippingOrders }),
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
			showReceiptModal({ error: `Bir hata oluştu: ${error.message}` });
		}
	});

	// Modal ve fiş fonksiyonları
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
		let title = "Kargo Başarıyla Oluşturuldu";
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

		// Başarı, hata, uyarı ayrımı
		if (apiData.error) {
			type = "error";
			title = "Bir Hata Oluştu";
			details = `<div>${apiData.error}</div>`;
		} else if (apiData.ShippingOrderResultVO) {
			const vo = apiData.ShippingOrderResultVO;
			if (vo.outFlag === "0") {
				type = "success";
				title = "Kargo Başarıyla Oluşturuldu";
				details = `
          <div class='receipt-detail-row'><b>Talep No:</b> ${vo.jobId}</div>
          <div class='receipt-detail-row'><b>Durum:</b> ${vo.outResult}</div>
          <div class='receipt-detail-row'><b>Kargo Adedi:</b> ${vo.count}</div>
          <div style='margin:10px 0 0 0;'><b>Kargo Listesi:</b></div>
          <div>
            ${vo.shippingOrderDetailVO
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
			} else if (vo.outFlag === "1") {
				// Hata veya uyarı
				if (
					vo.shippingOrderDetailVO &&
					vo.shippingOrderDetailVO.length > 0 &&
					vo.shippingOrderDetailVO[0].errCode === 59999
				) {
					type = "warning";
					title = "Kargo Zaten Mevcut";
				} else {
					type = "error";
					title = "Kargo Oluşturulamadı";
				}
				details = `
          <div class='receipt-detail-row'><b>Durum:</b> ${vo.outResult}</div>
          <div class='receipt-detail-row'><b>Hata Kodu:</b> ${
				vo.shippingOrderDetailVO[0]?.errCode ?? "-"
			}</div>
          <div class='receipt-detail-row'><b>Hata Mesajı:</b> ${
				vo.shippingOrderDetailVO[0]?.errMessage ?? "-"
			}</div>
          <div class='receipt-detail-row'><b>Kargo Anahtarı:</b> ${
				vo.shippingOrderDetailVO[0]?.cargoKey ?? "-"
			}</div>
          <div class='receipt-detail-row'><b>Fatura:</b> ${
				vo.shippingOrderDetailVO[0]?.invoiceKey ?? "-"
			}</div>
          <div style='margin:10px 0 0 0;'><b>Kargo Listesi:</b></div>
          <div>
            ${vo.shippingOrderDetailVO
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

	function showToggleJsonBtn() {
		let btn = document.getElementById("toggleJsonBtn");
		if (!btn) {
			btn = document.createElement("button");
			btn.id = "toggleJsonBtn";
			btn.textContent = "JSON Göster";
			btn.onclick = () => {
				if (lastViewMode === "receipt") {
					showJsonModal();
					btn.textContent = "Fiş Göster";
					lastViewMode = "json";
				} else {
					showReceiptModal(lastApiData);
					btn.textContent = "JSON Göster";
					lastViewMode = "receipt";
				}
			};
			const apiResponse = document.getElementById("apiResponse");
			apiResponse.parentNode.insertBefore(btn, apiResponse.nextSibling);
		}
		btn.style.display = "inline-block";
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

	// Sağ panelde toggle butonu olmasın, sadece modalda olsun

	// Modal kapatma
	document.querySelector(".close-modal").onclick = () => {
		document.getElementById("shipmentReceiptModal").classList.add("hidden");
	};
	// Modal dışına tıklayınca kapat
	window.onclick = function (event) {
		const modal = document.getElementById("shipmentReceiptModal");
		if (event.target === modal) {
			modal.classList.add("hidden");
		}
	};
	// Yazdır
	document.getElementById("printReceipt").onclick = () => {
		const printContents =
			document.getElementById("receiptContent").innerHTML;
		const win = window.open("", "", "width=600,height=700");
		win.document.write("<html><head><title>Kargo Fişi</title>");
		win.document.write(
			'<link rel="stylesheet" href="create-shipment.css">'
		);
		win.document.write("</head><body>" + printContents + "</body></html>");
		win.document.close();
		win.focus();
		win.print();
		win.close();
	};
	// Yeni pencerede aç
	document.getElementById("openReceiptWindow").onclick = () => {
		const printContents =
			document.getElementById("receiptContent").innerHTML;
		const win = window.open("", "", "width=600,height=700");
		win.document.write("<html><head><title>Kargo Fişi</title>");
		win.document.write(
			'<link rel="stylesheet" href="create-shipment.css">'
		);
		win.document.write("</head><body>" + printContents + "</body></html>");
		win.document.close();
		win.focus();
	};
});
