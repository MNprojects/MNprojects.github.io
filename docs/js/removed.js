//To be put in the HTML docs to call the JS file
<div><script src="docs/js/js.js"></script></div>

// For creating a list on clicks

var list = document.createElement('ul');
var info = document.createElement('p');
var html = document.querySelector('html');

info.textContent = 'Click anywhere outside the list to add a new list item. Click an existing list item to change its text to something else.';

document.body.appendChild(info);
document.body.appendChild(list);

html.onclick = function() {
  var listItem = document.createElement('li');
  var listContent = prompt('What content do you want the list item to have?');
  listItem.textContent = listContent;
  list.appendChild(listItem);

  listItem.onclick = function(e) {
    e.stopPropagation();
    var listContent = prompt('Enter new content for your list item');
    this.textContent = listContent;
  }
}



// for a shrinking navbar

$(document).on("scroll", function(){
    if
      ($(document).scrollTop() > 100){
      $("header").addClass("shrink");
    }
    else
    {
      $("header").removeClass("shrink");
    }
  });