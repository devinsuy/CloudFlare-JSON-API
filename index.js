/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) { 
  const url_parts = request.url.split("/");

  // The path /links is requested, serve the JS array of link objects 
  if (url_parts[url_parts.length - 1].toLowerCase() === "links"){
      let resp = new Response(body=JSON.stringify(value=links, replacer=null, space=2));
      resp.headers.set("Content-Type", "application/json")
      return resp
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
    element.classList.className = "text-md text-black mt-2 font-semibold";
    console.log("Done")
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
      "name": "A Better Internet!",
      "url": "https://www.cloudflare.com/learning/what-is-cloudflare/"
  },
  {
      "name": "Register To Vote",
      "url": "https://vote.gov/"
  },
  {
      "name": "Help End The Digital Divide",
      "url": "https://www.close-the-gap.org/donate"
  }
];
const avatar = "https://i.imgur.com/urUOtek.jpg";
const name = "Devin Suy";
const bg_color = "bg-gray-300";
const socials = [
  {
      "url": "https://www.linkedin.com/in/devin-suy-8651b2139/",
      "logo": "https://simpleicons.org/icons/linkedin.svg"
  },
  {
      "url": "https://www.instagram.com/dev__suy/",
      "logo": "https://simpleicons.org/icons/instagram.svg"
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