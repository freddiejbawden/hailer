// Code for Hailer
//

//Function to update the news cards shown
function updateContainer() {
  //Get the selected value of the country selector
  var target = $('#countrySelecter').find(":selected").text();
  $.get("details.json", function(data, status) {
    //Find the code for the country. There should never be the possiblity of
    //picking an option with no code due to the json file
    data.countries.some( function(value, index, _arr) {
      if (value.name == target) {
        updateCards(value.id);
      }
    });
  });
}
function clearCards() {
  var container = document.getElementById('root');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function updateCards(countryID) {
  //Remove all previous news cards


  //create new request URL
  var request = new XMLHttpRequest();
  var apiKey = "34631d89b3fa4f02800ae93577b35334";
  var keyURL = "apiKey="+apiKey;
  var countryURL = "country=" + countryID;
  var url = 'https://newsapi.org/v2/top-headlines?' + countryURL + "&"+ keyURL;

  //open a new request
  request.open('GET',url,true);

  //display error if request fails
  request.onerror = function () {
    var statusText = document.getElementById('statusTxt');
    statusText.textContent = "Sorry! We were unable to get any news at this " +
                             "time, please try again later.";
  }
  //specify call back function
  request.onload = function () {
    var data = JSON.parse(this.response);

    clearCards();

    data.articles.forEach(x => {
      //add card for each news source
      createNewsCard(x);
    });
  }
  //send request
  request.send();
}

function createNewsCard(x) {

  //create a news card based on data in x
  var app = document.getElementById('root');
  var article = document.createElement('div');
  article.setAttribute('class','article');

  var headline=document.createElement("headline");
  headline.setAttribute('class','headline');
  headline.textContent = x.title;


  var sepLine = document.createElement('div');
  sepLine.setAttribute('class','seperatorLineArticle');
  if (x.description != "" && x.description != null) {


    var articleContent = document.createElement("div");
    articleContent.setAttribute("class","articlecontent");
    articleContent.textContent = x.description;
    article.appendChild(headline);
    article.appendChild(sepLine);
    article.appendChild(articleContent);

  } else {
      headline.style.height = "40%";
      headline.style.paddingTop = "30%";
      article.appendChild(headline);
  }



  var readMoreButton = document.createElement('a');
  readMoreButton.setAttribute("href",x.url);
  readMoreButton.setAttribute("class","readmorelink");
  readMoreButton.textContent = "Read More";

  var source = document.createElement('span');
  source.setAttribute("class","articleSource");
  if (x.author != null && x.author.substring(0,4) != "http") {
      source.textContent = "Author: " + x.author + " | Source: " + x.source.name;
  } else {
    source.textContent = "Source: " + x.source.name;
  }




  article.appendChild(readMoreButton);
  article.appendChild(source);

  app.appendChild(article);
}


//Populate the country selector using a json file
const countries = $.get('details.json', function(data, status) {
    var selector = document.getElementById("countrySelecter");
    data.countries.forEach(x => {
      var opt = document.createElement('option');
      opt.text = x.name;
      selector.add(opt);
    });
});


$(document).ready(function() {

  updateContainer();
});
