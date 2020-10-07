function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"metcard.pug":"div(class='metcard' id=id)\n    img(src=imgSrc class='metimg')\n    div(class='swimblock top')\n        span #{text}\n        div(class='tags')\n            each val, index in tags\n                span(class='chips')= val\n    h3 #{title}\n    h4 #{place}\n    h5 #{dateStr}\n"};
;var locals_for_with = (locals || {});(function (dateStr, id, imgSrc, place, tags, text, title) {;pug_debug_line = 1;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"metcard\""+pug_attr("id", id, true, false)) + "\u003E";
;pug_debug_line = 2;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Cimg" + (" class=\"metimg\""+pug_attr("src", imgSrc, true, false)) + "\u002F\u003E";
;pug_debug_line = 3;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Cdiv class=\"swimblock top\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 4;pug_debug_filename = "metcard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 5;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Cdiv class=\"tags\"\u003E";
;pug_debug_line = 6;pug_debug_filename = "metcard.pug";
// iterate tags
;(function(){
  var $$obj = tags;
  if ('number' == typeof $$obj.length) {
      for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
        var val = $$obj[index];
;pug_debug_line = 7;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Cspan class=\"chips\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "metcard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = val) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
      }
  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;
      var val = $$obj[index];
;pug_debug_line = 7;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Cspan class=\"chips\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "metcard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = val) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 8;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Ch3\u003E";
;pug_debug_line = 8;pug_debug_filename = "metcard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = title) ? "" : pug_interp)) + "\u003C\u002Fh3\u003E";
;pug_debug_line = 9;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 9;pug_debug_filename = "metcard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = place) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 10;pug_debug_filename = "metcard.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 10;pug_debug_filename = "metcard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = dateStr) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E\u003C\u002Fdiv\u003E";}.call(this,"dateStr" in locals_for_with?locals_for_with.dateStr:typeof dateStr!=="undefined"?dateStr:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"imgSrc" in locals_for_with?locals_for_with.imgSrc:typeof imgSrc!=="undefined"?imgSrc:undefined,"place" in locals_for_with?locals_for_with.place:typeof place!=="undefined"?place:undefined,"tags" in locals_for_with?locals_for_with.tags:typeof tags!=="undefined"?tags:undefined,"text" in locals_for_with?locals_for_with.text:typeof text!=="undefined"?text:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}