'use strict';

{ /*variables*/
  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list';

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
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
    const linkHref = clickedElement.getAttribute('href');
    const articleId = linkHref.slice(1);
    //console.log(articleId);
  
    /* find the correct article using the selector (value of 'href' attribute) */
    const activeArticle = document.getElementById(articleId);
  
    /* add class 'active' to the correct article */
    activeArticle.classList.add('active');
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const generateTitleLinks = function(customSelector = ''){

    /* remove contents of titleList */
    document.querySelector(optTitleListSelector).innerHTML = '';
    
    /* find all the articles and save them to articles variable */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const generateTags = function(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

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

        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]){

          /* [NEW] add tag to allTags object*/
          allTags[tag] = 1;

          /* [NEW] else increment existing property*/
        } else {
          allTags[tag]++;
        }

        /* END LOOP: for each tag */
      }

      //console.log(html);

      /* insert HTML of all the links into the tags wrapper */
      tagsList.innerHTML = html;

      /* END LOOP: for every article: */
    }
    
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);

    /* [NEW] create variable for all links HTML code */
    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags: */
    for(const tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsHTML += '<li><a href="#tag-'+ tag +'">' + tag + ' (' + allTags[tag] + ')</a></li>';

      /* [NEW] END LOOP: for each tag in allTags: */
    }

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  
  };
  
  generateTags();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const tagClickHandler = function(event){
    /* prevent default action for this event */
    event.preventDefault();
      
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    //console.log(href);

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    //console.log(tag);

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    //console.log(activeTagLinks.length);

    /* START LOOP: for each active tag link */
    for(const activeTagLink of activeTagLinks){
    /* remove class active */
      activeTagLink.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
      
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (const tagLink of tagLinks){
      /* add class active */
      tagLink.classList.add('active');
      /* END LOOP: for each found tag link */
    }
      
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  const addClickListenersToTags = function(){
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for(const tagLink of tagLinks){
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click',tagClickHandler);
      /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  const generateAuthors = function(){
    const articles = document.querySelectorAll(optArticleSelector);
    for(const article of articles){
      const authorTag = article.querySelector(optArticleAuthorSelector);
      const authorName = article.getAttribute('data-author');
      //console.log(authorName);
      const authorLink = '<a href="#authorTag-' + authorName + '">' + authorName + '</a>';
      authorTag.innerHTML = authorLink;
    }
  };

  generateAuthors();

  const authorClickHandler = function(event){
    event.preventDefault;
    const clickedElement = this;
    //console.log('works');
    const href = clickedElement.getAttribute('href');
    const authorName = href.replace('#authorTag-','');
    console.log(authorName);
    generateTitleLinks('[data-author="' + authorName + '"]');
  };

  const addClickListenersToAuthors = function(){
    const authorLinks = document.querySelectorAll('a[href^="#authorTag-"]');
    for(const authorLink of authorLinks){
      authorLink.addEventListener('click', authorClickHandler);
    }
  };

  addClickListenersToAuthors();
}