const container = document.querySelector("main");
const popupBlock = document.querySelector(".popup-wrapper");
const popupAdd = popupBlock.querySelector(".popup-add");
const popupUpd = popupBlock.querySelector(".popup-upd");
const addForm = document.forms.addForm;
const updForm = document.forms.updForm;
const cards = document.getElementsByClassName("card");

popupBlock.querySelectorAll(".popup__close").forEach(function(btn) {
	btn.addEventListener("click", function() {
		popupBlock.classList.remove("active");
		btn.parentElement.classList.remove("active");
		if (btn.parentElement.classList.contains("popup-upd")) {
			updForm.dataset.id = ""; 
		}
	});
});

document.querySelector("#add").addEventListener("click", function(e) {
	e.preventDefault();
	popupBlock.classList.add("active");
	popupAdd.classList.add("active");
});

const createCard = function(cat, parent) {
	const card = document.createElement("div");
	card.className = "card";
	card.dataset.id = cat.id; 
	

	const img = document.createElement("div");
	img.className = "card-pic";
	if (cat.img_link) {
		img.style.backgroundImage = `url(${cat.img_link})`;
	} else {
		img.style.backgroundImage = "url(img/cat.png)";
		img.style.backgroundSize = "contain";
		img.style.backgroundColor = "transparent";
	}

	const name = document.createElement("h3");
	name.innerText = cat.name;

	let like = "";
	like.onclick = () => {
		
	}

	const del = document.createElement("button");
	del.innerText = "Убрать котика";
	del.id = cat.id;
	del.addEventListener("click", function(e) {
		let id = e.target.id;
		deleteCat(id, card);
	});

	const upd = document.createElement("button");
	upd.innerText = "Изменить котика";
	upd.id = cat.id;
	upd.addEventListener("click", function(e) {
		popupUpd.classList.add("active");
		popupBlock.classList.add("active");
		showForm(cat);
		updForm.setAttribute("data-id", cat.id);
	})
	card.append(img, name, del, upd);
	parent.append(card);
}

const showForm = function(data) {
	console.log(data);
	for (let i = 0; i < updForm.elements.length; i++) {
		let el = updForm.elements[i];
		if (el.name) {
			if (el.type !== "checkbox") {
				el.value = data[el.name] ? data[el.name] : "";
			} else {
				el.checked = data[el.name];
			}
		}
	}
}

// createCard({name: "Пуша", img_link: "https://storage-api.petstory.ru/resize/1000x1000x80/65/8c/ed/658cedad9065491c8a343c599f9965c2.jpeg"}, container);
fetch("https://sb-cats.herokuapp.com/api/2/Dari-Sha/show")
	
	.then(res => res.json()) 
	
	.then(result => { 
		
		if (result.message === "ok") {
			console.log(result.data);
			result.data.forEach(function(el) {
				createCard(el, container);
			})
		}
	})

const addCat = function(cat) {
	fetch(`https://sb-cats.herokuapp.com/api/2/Dari-Sha/add`, {
		method: "POST",
		headers: { 
			"Content-Type": "application/json"
		},
		body: JSON.stringify(cat) 
	})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if (data.message === "ok") {
				createCard(cat, container);
				addForm.reset();
				popupBlock.classList.remove("active");
			}
		})
}

const deleteCat = async function(id, tag) {
	
		fetch(`https://sb-cats.herokuapp.com/api/2/Dari-Sha/delete/${id}`, {
			method: "DELETE"
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if (data.message === "ok") {
				tag.remove();
			}
		})
	
	let res = await fetch(`https://sb-cats.herokuapp.com/api/2/Dari-Sha/delete/${id}`, {
		method: "DELETE"
	});

	let data = await res.json();
	
	if (data.message === "ok") {
		tag.remove();
	}


}
addForm.addEventListener("submit", function(e) {
	e.preventDefault();
	let body = {}; 

	for (let i = 0; i < addForm.elements.length; i++) {
		let el = addForm.elements[i];
		console.log(el);
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}

	console.log(body);
	addCat(body);
});
updForm.addEventListener("submit", function(e) {
	e.preventDefault();
	let body = {}; 

	for (let i = 0; i < this.elements.length; i++) {
		let el = this.elements[i];
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}
	delete body.id;
	console.log(body);
	updCat(body, updForm.dataset.id);
});

const updCat = async function(obj, id) {
	let res = await fetch(`https://sb-cats.herokuapp.com/api/2/Dari-Sha/update/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj)
	})
	let answer = await res.json();
	console.log(answer);
	if (answer.message === "ok") {
		updCard(obj, id);
		updForm.reset();
		updForm.dataset.id = "";
		popupUpd.classList.remove("active");
		popupBlock.classList.remove("active");
	}
}

const updCard = function(data, id) {
	for (let i = 0; i < cards.length; i++) {
		let card = cards[i];
		if (card.dataset.id === id) {
			card.firstElementChild.style.backgroundImage = data.img_link ? `url(${data.img_link})` : `url(img/cat.png)`;
			card.querySelector("h3").innerText = data.name || "noname";
		}
	}
}

let tooltipElem;

    document.onmouseover = function(event) {
      let target = event.target;

      // если у нас есть подсказка...
      let tooltipHtml = target.dataset.tooltip;
      if (!tooltipHtml) return;

      // ...создадим элемент для подсказки

      tooltipElem = document.createElement('div');
      tooltipElem.className = 'tooltip';
      tooltipElem.innerHTML = tooltipHtml;
      document.body.append(tooltipElem);

      // спозиционируем его сверху от аннотируемого элемента (top-center)
      let coords = target.getBoundingClientRect();

      let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
      if (left < 0) left = 0; // не заезжать за левый край окна

      let top = coords.top - tooltipElem.offsetHeight - 5;
      if (top < 0) { // если подсказка не помещается сверху, то отображать её снизу
        top = coords.top + target.offsetHeight + 5;
      }

      tooltipElem.style.left = left + 'px';
      tooltipElem.style.top = top + 'px';
    };

    document.onmouseout = function(e) {

      if (tooltipElem) {
        tooltipElem.remove();
        tooltipElem = null;
      }

    };