'use strict';

{ /*variables*/
  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list';

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    //console.log('Link was clicked!');
    //console.log(event);
  
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
  
    /* add class 'active' to the clicked link */
    //console.log('clickedElement: ', clickedElement);
    clickedElement.classList.add('active');
  
    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
  
    /* get 'href' attribute from the clicked link */
    const linksHref = clickedElement.getAttribute('href');
    const articleId = linksHref.slice(1);
    //console.log(articleId);
  
    /* find the correct article using the selector (value of 'href' attribute) */
    const activeArticle = document.getElementById(articleId);
  
    /* add class 'active' to the correct article */
    activeArticle.classList.add('active');
  };


  const generateTitleLinks = function(){

    /* remove contents of titleList */
    document.querySelector(optTitleListSelector).innerHTML = '';
    
    /* find all the articles and save them to articles variable */
    const articles = document.querySelectorAll(optArticleSelector);
    //console.log('Articles list: ', articles);

    let html = '';
      
    for(const article of articles){
    
      /* get the article id */
      const articleId = article.getAttribute('id');
    
      /* find the title element and get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      //console.log(articleTitle);
    
      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      //console.log(linkHTML);
    
      /*insert link into html variable */
      html += linkHTML;
      //console.log('html --> ',html);
    }

    /* insert link into titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = html;

    /*add listeners to generated links */
    const links = document.querySelectorAll('.titles a');
  
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  const generateTags = function(){
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
  
    /* START LOOP: for every article: */
    for(const article of articles){
      /* find tags wrapper */
      const tagsList = article.querySelector(optArticleTagsSelector);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      
      /* START LOOP: for each tag */
      for (const tag of articleTagsArray){

        /* generate HTML of the link */
        const linkHTML = '<li><a href="#tag-'+ tag +'">' + tag + '&nbsp</a></li>';

        /* add generated code to html variable */
        html += linkHTML;

        /* END LOOP: for each tag */
      }

      //console.log(html);

      /* insert HTML of all the links into the tags wrapper */
      tagsList.innerHTML = html;
    }
    
  /* END LOOP: for every article: */
  };
  
  generateTags();
}