'use strict';

import scrape from 'website-scraper';
import MyResourceSaver from './resourceSaver';
import rimraf from 'rimraf';
import cheerio from 'cheerio';

const script = '<script>document.addEventListener("DOMContentLoaded", function(event) {console.log("DOM fully loaded and parsed");});</script>';

const config = {
  urls: ['http://octobear.webflow.io/'],
  directory: 'webflow/',
  webflowBadgeClass: '.w-webflow-badge'
}

const options = {
  urls: config.urls,
  directory: config.directory
  //resourceSaver: new MyResourceSaver(Object.assign({}, defaults, options))
}

const perform = () => {
  scrape(options).then((result) => {
    //let resources = new Array;
    //result.forEach( (res, i, arr) => {
    //  //console.log(res.getText());
    //  let html = res.getText();
    //  let $ = cheerio.load(html);
    //  //$(config.webflowBadgeClass).remove();
    //  let out = $('body').append(script);
    //  console.log(out.html());
    //  res.setText(out.html());
    //  resources.push(res);
    //});
    //console.log(resources);
    console.log('Saved to ' + options.directory);
  }).catch((err) => {
    console.log(err);
  });
}

rimraf(options.directory, perform);

