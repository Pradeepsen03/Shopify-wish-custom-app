const wish05ShopUrl = window.shopUrl.split("//")[1];

const customer = document.getElementById("wishiy-id-cus");
const cus_id = customer.innerHTML;
console.log("cuu", cus_id);

function ShowwishList(){
  if (cus_id) {
    fetch(`https://shopify-wish-custom-app.onrender.com/api/get-wishlist?shop=${wish05ShopUrl}&id=${cus_id}`, {
      method: "GET"
    })
      .then((response) => {
        console.log("res", response);
        return response.json(); // Return the parsed JSON
      })
      .then((data) => {
        const wishlistData = document.getElementById("wishiy-05-body");
        console.log("Received wishlist data:", data, data?.data?.length);
  
        if (data?.data?.length > 0) {
          const rows = data.data
            .map(
              (item, index) => `
      <tr style="border-bottom: 1px solid #d1d5db;">
        <td style="vertical-align: middle; padding: 0.75rem 1.5rem;">
          <a href="#">
            <img src="${item?.data?.node?.media?.edges?.[0]?.node?.preview?.image?.url || "./assets/images/products/default.jpg"}" style="width: 8rem; height: 8rem; max-width: 100%;" alt="Product Image">
          </a>
        </td>
        <td style="vertical-align: middle; padding: 0.75rem 1.5rem;">
          <div>
            <div style="font-size: 1rem; font-weight: 600; color: #111; overflow: hidden;">
              <a href="/products/${item?.data?.node?.handle}" style="color: inherit; overflow: hidden;">
                ${item?.data?.node?.title || "Unknown Product"}
              </a>
            </div>
          </div>
        </td>
        <td style="vertical-align: middle; padding: 0.75rem 1.5rem; font:15px bold ;">
          $${parseFloat(item?.data?.node?.variants?.edges?.[0]?.node?.price || 0).toFixed(2)}
        </td>
        <td style="vertical-align: middle; padding: 1rem 1.5rem;">
          <span style="display: inline-block; padding: 0.5rem; text-align: center; font-weight: 600; font-size: 1rem; vertical-align: baseline; border-radius: 0.375rem; color: white; background-color: ${item?.data?.node?.hasOutOfStockVariants ? "#dc2626" : "#16a34a"};">
            ${item?.data?.node?.hasOutOfStockVariants ? "Out of Stock" : "In Stock"}
          </span>
        </td>
        <td style="vertical-align: middle; padding: 0.75rem 1.5rem;">
          <button style="color: #4b5563; display: inline-block; cursor:pointer; " data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete" title="Delete" onclick="deleteproductWish('${item?.data?.node?.id}')" class="remove-05-test">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M4 7l16 0"></path>
              <path d="M10 11l0 6"></path>
              <path d="M14 11l0 6"></path>
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
            </svg>
          </button>
        </td>
      </tr>
    `,
            )
            .join("");
  
          wishlistData.innerHTML = rows;
        } else {
          wishlistData.innerHTML = "<p>No items in wishlist.</p>";
        }
      })
      .catch((error) => console.error("Error fetching wishlist:", error));
  } else {
    console.error("Customer ID element not found or is empty!");
  }
  
}

ShowwishList();
function deleteproductWish(id) {
  console.log("delete", id);
  const productId = id.split("/").pop();
  console.log("real one", productId);

  fetch(`https://shopify-wish-custom-app.onrender.com/api/delete-wish`, {
    method: "POST",
    body: JSON.stringify({
      shop: wish05ShopUrl,
      productId: productId,
      cusId: cus_id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message || "Wishlist updated successfully!");
      ShowwishList();
    })
    .catch((error) => console.error("Error deleting to wishlist:", error));
}

const modal = document.querySelector(".modal-05-test"); 
const overlay = document.querySelector(".overlay-05-test");
const openModalBtn = document.querySelector(".btn-open-05-test");
const closeModalBtn = document.querySelector(".btn-close-test-05");

const closeModal = function () {
  modal.classList.add("hidden-05-test");
  overlay.classList.add("hidden-05-test");
};

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

const openModal = function () {
  ShowwishList();
  modal.classList.remove("hidden-05-test");
  overlay.classList.remove("hidden-05-test");
};

openModalBtn.addEventListener("click", openModal);


function addToWishlist(productId, customer) {
  console.log("gooood", customer);
  fetch(`https://shopify-wish-custom-app.onrender.com/api/save-wishlist`, {
    method: "POST",
    body: JSON.stringify({
      shop: wish05ShopUrl,
      productId: productId,
      cusId: customer,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message || "Wishlist updated successfully!");
    })
    .catch((error) => {
      alert("Already added product to wishlist");
      console.error("Error saving to wishlist:", error)
      
    }
  );
}
