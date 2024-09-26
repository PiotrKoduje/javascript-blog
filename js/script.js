'use strict';

{ /*variables*/

  const opts = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post-author',
    tagsListSelector: '.tags.list',
    cloudClassCount: 5,
    cloudClassPrefix: 'tag-size-',
    authorsListSelector: '.list.authors',
  };

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tagcloud-link').innerHTML),
    authorListLink: Handlebars.compile(document.querySelector('#template-authorlist-link').innerHTML)
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

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
    document.querySelector(opts.titleListSelector).innerHTML = '';
    
    /* find all the articles and save them to articles variable */
    const articles = document.querySelectorAll(opts.articleSelector + customSelector);
    //console.log('Articles list: ', articles);

    let html = '';
      
    for(const article of articles){
    
      /* get the article id */
      const articleId = article.getAttribute('id');
    
      /* find the title element and get the title from the title element */
      const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
      //console.log(articleTitle);
    
      /* create HTML of the link */
      //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      const linkHTMLData = {
        id: articleId,
        title: articleTitle
      };
      const linkHTML = templates.articleLink(linkHTMLData);
      //console.log(linkHTML);
    
      /*insert link into html variable */
      html += linkHTML;
      //console.log('html --> ',html);
    }

    /* insert link into titleList */
    const titleList = document.querySelector(opts.titleListSelector);
    titleList.innerHTML = html;

    /*add listeners to generated links */
    const links = document.querySelectorAll('.titles a');
  
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const calculateTagsParams = function(tags){
    const params = {min: 999, max: 0};
    for(const tag in tags){
      if (tags[tag] < params.min){
        params.min = tags[tag];
      }
      if(tags[tag] > params.max){
        params.max = tags[tag];
      }
    }
    return params;
  };

  const calculateTagClass = function(count,params){
    const normalizedCount = count - params.min;
    const normalizedMax = params.max != params.min ? params.max - params.min : 0;
    const percentage = normalizedCount/normalizedMax;
    const classNumber = Math.floor(percentage*(opts.cloudClassCount - 1) + 1);
    return opts.cloudClassPrefix + classNumber;
  };

  const generateTags = function(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(opts.articleSelector);
  
    /* START LOOP: for every article: */
    for(const article of articles){
      /* find tags wrapper */
      const tagsList = article.querySelector(opts.articleTagsSelector);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      
      /* START LOOP: for each tag */
      for (const tag of articleTagsArray){

        /* generate HTML of the link */
        //const linkHTML = '<li><a href="#tag-'+ tag +'">' + tag + '</a></li>';
        const linkHTMLData = {tag: tag};
        const linkHTML = templates.tagLink(linkHTMLData);

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
    const tagList = document.querySelector(opts.tagsListSelector);

    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    //console.log('tagsParams:', tagsParams);
    //let allTagsHTML = '';
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */
    for(const tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      //allTagsHTML += '<li><a href="#tag-'+ tag +'" class=' + calculateTagClass(allTags[tag], tagsParams) + '>' + tag + '</a></li>';
      allTagsData.tags.push({
        tag: tag,
        className: calculateTagClass(allTags[tag], tagsParams)
      });
      /* [NEW] END LOOP: for each tag in allTags: */
    }

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    //console.log(allTagsData);
  
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
    let allAuthors = {};
    const articles = document.querySelectorAll(opts.articleSelector);
    for(const article of articles){
      const authorTag = article.querySelector(opts.articleAuthorSelector);
      const authorName = article.getAttribute('data-author');
      //console.log(authorName);
      if(!allAuthors[authorName]){
        allAuthors[authorName] = 1;
      } else {
        allAuthors[authorName]++;
      }
      
      //const authorLink = '<a href="#authorTag-' + authorName + '">' + authorName + '</a>';
      const linkHTMLData = {name: authorName};
      const linkHTML = templates.authorLink(linkHTMLData);
      authorTag.innerHTML = linkHTML;
    }
    //console.log('allAuthors: ', allAuthors);
    const authorsList = document.querySelector(opts.authorsListSelector);
    //console.log('authorsList', authorsList);
    //let allAuthorsHTML = '';
    const allAuthorsData = {authors: []};
    for(const author in allAuthors){
      //allAuthorsHTML += '<li><a href="#authorTag-' + author + '"><span>' + author + ' ('+ allAuthors[author] + ')</span></a></li>';
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author]
      });
    }
    //console.log(allAuthorsData);
    authorsList.innerHTML = templates.authorListLink(allAuthorsData);
  };

  generateAuthors();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const authorClickHandler = function(event){
    event.preventDefault;
    const clickedElement = this;
    
    //console.log('works');
    const href = clickedElement.getAttribute('href');
    const authorName = href.replace('#authorTag-','');
    //console.log(authorName);
    generateTitleLinks('[data-author="' + authorName + '"]');

    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#authorTag-"]');
    for(const activeAuthor of activeAuthorLinks){
      activeAuthor.classList.remove('active');
    }
    //console.log('activeAuthorLinks', activeAuthorLinks);

    const authorLinks = document.querySelectorAll('a[href="#authorTag-' + authorName + '"]');
    for(const authorLink of authorLinks){
      authorLink.classList.add('active');
    }
    //console.log('authorLinks', authorLinks);
  };

  const addClickListenersToAuthors = function(){
    const authorLinks = document.querySelectorAll('a[href^="#authorTag-"]');
    for(const authorLink of authorLinks){
      authorLink.addEventListener('click', authorClickHandler);
    }
  };

  addClickListenersToAuthors();
}