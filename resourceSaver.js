'use strict';

import ResourceSaver from 'website-scraper/lib/resource-saver';

class MyResourceSaver extends ResourceSaver {
  constructor() {
    super(options)
  }

  saveResource(resource) {
    const filename = path.join(this.absoluteDirectoryPath, resource.getFilename());
    //const text = resource.getText();
    //console.log(res.getText());
    let text = resource.getText();
    let $ = cheerio.load(text);
    //$(config.webflowBadgeClass).remove();
    let out = $('body').append(script);
    console.log(out.html());
    resource.setText(out.html());
    return fs.outputFile(filename, text, { encoding: 'binary' }).then(() => {
      this.loadedResources.push(resource);
    });
  }
}

export default MyResourceSaver;
