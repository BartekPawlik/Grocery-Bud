const box = document.querySelector('.grocery-box')
const alert = document.querySelector('.alert')
const grocery = document.querySelector('.input')
const submit = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const clearBtn = document.querySelector('.clear-btn')
const list = document.querySelector('.grocery-list')

// edit option
let editElement;
let editFlag = false;
let editID = "";

// Event Listeners

clearBtn.addEventListener('click' ,clearItems)
box.addEventListener("submit", addItem)
window.addEventListener('DOMContentLoaded', setupItems)

function addItem(e){
    e.preventDefault()
    const value = grocery.value; 
    const id = new Date().getTime().toString();
    if(value && !editFlag){
        CreateListItem(id, value)
      
      displayAlert('allert added to the list','succes');
      container.classList.add('show-container')

      addToLocalStorage(id,value)

      setBackToDefault()
    

    }
    else if(value && editFlag){
       editElement.innerHTML = value;
        displayAlert('value changed', 'succes');
        editLocalStorage(editID,value);
        setBackToDefault();
    }
    else{
      displayAlert('please enter value','danger');
    }


    
}    

function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    
    setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
        
    },1000);
}

function clearItems(){
const items = document.querySelectorAll('.grocery-item');

if(items.length > 0){
    items.forEach(function(item){
        list.removeChild(item);
    })
}
container.classList.remove('show-container');
displayAlert('empty list', "danger");
setBackToDefault()
localStorage.removeItem('list')
}



function setBackToDefault(){
   grocery.value = ''
   editFlag = false;
   editID = '';
   submit.textContent = 'submit'
}





function delateItem(e){
const element = e.currentTarget.parentElement.parentElement;
const id = element.dataset.id;
list.removeChild(element);
if(list.children.length === 0){
    container.classList.remove("show-container");
}
displayAlert("item removed",'danger');
setBackToDefault()
removeFromLocalStorage(id)

}


function editItem(e){
//    const element = e.currentTarget.parentElement.parentElement;

editElement = e.currentTarget.parentElement.previousElementSibling;
  

grocery.value = editElement.innerHTML;
editFlag = true;
submit.textContent = 'edit';
editID = element.dataset.id;
console.log(e)

}

function addToLocalStorage(id, value){
    const grocery = {id, value}
  let items = getLocalStorage();
 
  items.push(grocery)
  localStorage.setItem("list", JSON.stringify(items))
  console.log(items)
    
    // console.log('added to local storage');
}

function removeFromLocalStorage(id){
let items = getLocalStorage()
items = items.filter(function (item){
    if(item.id !== id) {
        return item
    }
  
});
localStorage.setItem("list", JSON.stringify(items))

}
function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function (item){
        if(item.id === id ){
            item.value = value;
        }
        return item;
    })
    localStorage.setItem("list", JSON.stringify(items))

}


function getLocalStorage() {
   return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : []
}
// localStorage.setItem('orange', JSON.stringify(["item", 'item']))
// const oranges = JSON.parse(localStorage.getItem('orange'))
// console.log(oranges)
// localStorage.removeItem('orange')

function setupItems(){
    let items = getLocalStorage()
    if(items.length > 0){
        items.forEach(function(item){
            CreateListItem(item.id,item.value)
        })
        container.classList.add("show-container")
    }
}


function CreateListItem(id, value){
    const element = document.createElement('article')
      element.classList.add('grocery-item')
      const attr = document.createAttribute('data-id')
      attr.value = id;
      element.setAttributeNode(attr);
      element.innerHTML = `<p class="title">${value}</p>
      <div class="btn-container">
          <button type="button" class="edit-btn">
              <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="delete-btn">
              <i class="fas fa-trash"></i>
          </button>
      </div>`;
      const deleteBtn = element.querySelector('.delete-btn');
      const editBtn = element.querySelector('.edit-btn');
      deleteBtn.addEventListener('click', delateItem);
      editBtn.addEventListener('click', editItem);

      list.appendChild(element);
}