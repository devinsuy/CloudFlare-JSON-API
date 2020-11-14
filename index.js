/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) { 
  const url_parts = request.url.split("/");
  num_parts = url_parts.length;
  rsc_index = (url_parts[num_parts-1].length === 0) ? num_parts-2 : num_parts-1;

  // The path /links is requested, serve the JS array of link objects 
  if (url_parts[rsc_index].toLowerCase() === "links"){
      let resp = new Response(body=JSON.stringify(value=links, replacer=null, space=2));
      resp.headers.set("Content-Type", "application/json");
      return resp;
  }
  else if (url_parts[rsc_index].toLowerCase() === "linkedin" || url_parts[rsc_index].toLowerCase() === "in"){
      return Response.redirect(socials[0]["url"], 301);
  }
  else if (url_parts[rsc_index].toLowerCase() === "resume"){
      return Response.redirect(socials[1]["url"], 301);
  }
  else if (url_parts[rsc_index].toLowerCase() === "git" || url_parts[rsc_index].toLowerCase() === "github"){
      return Response.redirect(socials[2]["url"], 301);
  }

  // Otherwise rewrite and serve the HTML page
  return new HTMLRewriter()
      .on("title", new SetName(name))
      .on("div#profile", new EnableDisplay())
      .on("img#avatar", new SetAvatar(avatar))
      .on("h1#name", new SetName(name))
      .on("div#links", new LinkWriter(links))
      .on("div#social", new EnableDisplay())
      .on("div#social", new SetSocials(socials))
      .on("body.bg-gray-900", new SetColor(bg_color))
      .transform(await fetch('https://static-links-page.signalnerve.workers.dev'));
}

// Modularize HTMLRewriter functionality 
class SetName{
  constructor(name) { this.name = name; }
  async element(element){ 
      element.setInnerContent(this.name);
      element.setAttribute("class", "text-md text-black mt-2 font-semibold");
    }
}
// Removes the default style="display: none" attribute
class EnableDisplay {
  async element(element) { 
      if (element.getAttribute("style") == "display: none") {
          element.removeAttribute("style");
      }
  }
}
class SetAvatar {
  constructor(avatar) { this.avatar = avatar; }
  async element(element) { element.setAttribute("src", this.avatar); }
}
class LinkWriter {
  constructor(links) { this.links = links; }
  async element(element) {
      let links_HTML = "";
      // Iterate the links and build the HTML to be added
      for (let i = 0; i < this.links.length; i++){
          let link = this.links[i];
          links_HTML = links_HTML.concat("<a href=\"".concat(link["url"], "\">", link["name"], "</a>"));
      }        
      element.setInnerContent(links_HTML, {html:true});
  }
}
class SetSocials{
  constructor(socials) { this.socials = socials; }
  async element(element){
      let socials_HTML = "";
      // Iterate the socials links/logos and build the HTML
      for (let i = 0; i < this.socials.length; i++){
          let social = this.socials[i];
          socials_HTML = socials_HTML.concat(
              "<a href=\"".concat(social["url"], "\"> <img src=\"", social["logo"], "\"> </a> "));
      }
      element.setInnerContent(socials_HTML, {html:true});
  }
}
class SetColor{
  constructor(color) { this.color = color; }
  async element(element){
      element.setAttribute("class", this.color);
  }
}

// HTML Rewriter resources, modify as necessary
const links = [
  {
      "name": "LinkedIn",
      "url": "https://www.linkedin.com/in/devin-suy-8651b2139/"
  },
  {
      "name": "Resume",
      "url": "https://drive.google.com/file/d/16oocU1nh7n2fxVhQ_FQqS4GbUbRx3-ZV/view"
  },
  {
      "name": "GitHub Repository",
      "url": "https://github.com/devinsuy"
  }
];
const avatar = "https://i.imgur.com/urUOtek.jpg";
const name = "Devin Suy";
const bg_color = "bg-blue-100";
const socials = [
  {
      "url": "https://www.linkedin.com/in/devin-suy-8651b2139/",
      "logo": "https://simpleicons.org/icons/linkedin.svg"
  },
  {
      "url": "https://drive.google.com/file/d/16oocU1nh7n2fxVhQ_FQqS4GbUbRx3-ZV/view",
      "logo": "https://www.flaticon.com/svg/static/icons/svg/85/85047.svg"
  },
  {
      "url": "https://github.com/devinsuy",
      "logo": "https://simpleicons.org/icons/github.svg"
  }
];

// Event listener for handling requests
addEventListener('fetch', event => {
event.respondWith(handleRequest(event.request));
})