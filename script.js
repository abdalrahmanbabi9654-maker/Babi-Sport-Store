const whatsappNumber = "963952737292";
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const toast = document.querySelector(".toast");
const checkoutModal = document.querySelector("#checkout-modal");
const checkoutForm = document.querySelector("#checkout-form");
let toastTimeout;

function createBootPlaceholder(isGreen) {
  const accent = isGreen ? "#b5dc35" : "#9e3437";
  const trim = isGreen ? "#252a20" : "#f0ece5";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360"><defs><linearGradient id="upper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" offset="0"/><stop stop-color="#d7d0c6" offset="1"/></linearGradient><filter id="s"><feGaussianBlur stdDeviation="12"/></filter></defs><ellipse cx="303" cy="278" rx="205" ry="25" fill="#30291f" opacity=".2" filter="url(#s)"/><g transform="rotate(-10 300 180)"><path d="M94 217c30-13 60-30 77-53l38-72c8-15 21-26 34-22 19 5 32 30 52 45 32 24 71 38 110 49 43 12 90 26 108 59 10 18 2 34-23 42-67 22-174 17-262 10-63-5-123-17-146-34-16-12-7-18 12-24Z" fill="url(%23upper)"/><path d="M199 129c16-26 28-54 43-58 13-4 25 20 42 35 31 27 70 42 108 54l-40 62-86 22-99-27 32-88Z" fill="${accent}"/><path d="M87 220c32 22 84 34 150 41 98 11 217 17 270-3 19-7 28-18 22-31-14 17-49 23-85 25-80 5-183-4-255-14-45-7-80-15-101-29Z" fill="${trim}"/><path d="M89 223c32 22 83 33 149 41 96 11 215 15 269-4" fill="none" stroke="#c49c5a" stroke-width="9" stroke-linecap="round"/><path d="m244 106 77 52m-91-38 81 54m-92-41 81 55m-91-40 78 51" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="m166 252-11 24m73-17-7 27m81-23-2 28m84-27 5 27m73-31 12 22" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round"/></g></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

document.querySelectorAll(".gallery-main-image").forEach((image) => {
  image.addEventListener("error", () => {
    if (image.currentSrc.startsWith("data:image/svg+xml")) return;
    image.src = createBootPlaceholder(image.closest(".product-image").classList.contains("product-image-green"));
  });
});

document.querySelectorAll(".product-gallery").forEach((gallery) => {
  const imagePaths = gallery.dataset.gallery.split("|").map((path) => path.trim()).filter(Boolean);
  const mainImage = gallery.querySelector(".gallery-main-image");
  const thumbnails = gallery.querySelector(".gallery-thumbnails");

  imagePaths.forEach((path, index) => {
    const thumbnail = document.createElement("button");
    thumbnail.className = "gallery-thumbnail";
    thumbnail.type = "button";
    thumbnail.setAttribute("aria-label", `عرض صورة المنتج ${index + 1}`);
    thumbnail.setAttribute("aria-pressed", String(index === 0));
    if (index === 0) thumbnail.classList.add("is-active");

    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = path;
    thumbnailImage.alt = `صورة مصغرة: ${mainImage.alt}`;
    thumbnailImage.loading = "lazy";
    thumbnail.append(thumbnailImage);

    thumbnail.addEventListener("click", () => {
      mainImage.src = path;
      thumbnails.querySelectorAll(".gallery-thumbnail").forEach((button) => {
        const isSelected = button === thumbnail;
        button.classList.toggle("is-active", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });
    });

    thumbnails.append(thumbnail);
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "فتح القائمة" : "إغلاق القائمة");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح القائمة");
    navigation.classList.remove("is-open");
  });
});

function updatePaymentInstructions() {
  const isShamCash = checkoutForm.elements["payment-method"].value === "shamcash";
  const paymentNote = document.querySelector("#checkout-payment-note");
  paymentNote.classList.toggle("is-cash", !isShamCash);
  paymentNote.querySelector(".checkout-account-row").hidden = !isShamCash;
  document.querySelector("#checkout-payment-instruction").textContent = isShamCash
    ? "يرجى تحويل المبلغ إلى الحساب أعلاه وإرسال صورة الحوالة عبر واتساب.\nPlease transfer the amount to the account above and attach/send the transfer screenshot via WhatsApp."
    : "ادفع نقداً عند استلام طلبك في دمشق.\nPay in cash upon receiving your order in Damascus.";
}

function openCheckout(card) {
  const productName = card.querySelector(".product-title-row h3");
  document.querySelector("#checkout-product-name").textContent = productName.textContent.trim();
  const price = card.querySelector(".price");
  document.querySelector("#checkout-product-price").textContent =
    `${price.querySelector("strong").textContent.trim()} ${price.querySelector("span").textContent.trim()}`;
  checkoutForm.reset();
  updatePaymentInstructions();
  checkoutModal.showModal();
  requestAnimationFrame(() => checkoutForm.elements["customer-name"].focus({ preventScroll: true }));
}

document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("button, a, input, textarea, select")) return;
    openCheckout(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.target !== card || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    openCheckout(card);
  });
});

document.querySelectorAll(".order-button").forEach((button) => {
  button.addEventListener("click", () => openCheckout(button.closest(".product-card")));
});

checkoutForm.querySelectorAll('input[name="payment-method"]').forEach((input) => {
  input.addEventListener("change", updatePaymentInstructions);
});

checkoutModal.querySelector("[data-close-checkout]").addEventListener("click", () => checkoutModal.close());
checkoutModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  checkoutModal.close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && checkoutModal.open) {
    event.preventDefault();
    checkoutModal.close();
  }
});
checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) checkoutModal.close();
});

async function copyShamCashAccount() {
  try {
    await navigator.clipboard.writeText("2524647202955822");
    showToast("تم نسخ رقم حساب شام كاش");
  } catch (error) {
    const fallback = document.createElement("textarea");
    fallback.value = "2524647202955822";
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.append(fallback);
    fallback.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (copyError) {
      copied = false;
    } finally {
      fallback.remove();
    }
    showToast(copied ? "تم نسخ رقم حساب شام كاش" : "تعذّر النسخ. انسخ الرقم يدوياً: 2524647202955822");
  }
}

document.querySelectorAll(".copy-button, .checkout-copy-button").forEach((button) => {
  button.addEventListener("click", copyShamCashAccount);
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!checkoutForm.reportValidity()) return;

  const formData = new FormData(checkoutForm);
  const paymentMethod = formData.get("payment-method") === "shamcash"
    ? "شام كاش (ShamCash Transfer)"
    : "الدفع عند الاستلام (Cash on Delivery)";
  const message = [
    "مرحباً، أود تأكيد طلبي من Babi Sport Store:",
    `المنتج: ${document.querySelector("#checkout-product-name").textContent}`,
    `السعر: ${document.querySelector("#checkout-product-price").textContent}`,
    `طريقة الدفع: ${paymentMethod}`,
    `اسم الزبون: ${formData.get("customer-name")}`,
    `رقم الهاتف: ${formData.get("customer-phone")}`,
    `عنوان التوصيل في دمشق: ${formData.get("delivery-address")}`,
  ].join("\n");

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  checkoutModal.close();
});

document.querySelector("#year").textContent = String(new Date().getFullYear());
