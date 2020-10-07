function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (dateStr, place, tags, text, title) {;pug_debug_line = 1;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Cdiv class=\"metcard\" id=\"#{id}\"\u003E";
;pug_debug_line = 2;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Cimg class=\"metimg\" src=\"!{imgSrc}\"\u002F\u003E";
;pug_debug_line = 3;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Cdiv class=\"swimblock top\"\u003E";
;pug_debug_line = 4;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 4;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + (pug.escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 5;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Cdiv class=\"tags\"\u003E";
;pug_debug_line = 6;pug_debug_filename = ".\u002Fmetcard.pug";
// iterate tags
;(function(){
  var $$obj = tags;
  if ('number' == typeof $$obj.length) {
      for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
        var val = $$obj[index];
;pug_debug_line = 7;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Cspan class=\"chips\"\u003E";
;pug_debug_line = 7;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + (pug.escape(null == (pug_interp = val) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
      }
  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;
      var val = $$obj[index];
;pug_debug_line = 7;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Cspan class=\"chips\"\u003E";
;pug_debug_line = 7;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + (pug.escape(null == (pug_interp = val) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 8;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Ch3\u003E";
;pug_debug_line = 8;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + (pug.escape(null == (pug_interp = title) ? "" : pug_interp)) + "\u003C\u002Fh3\u003E";
;pug_debug_line = 9;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 9;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + (pug.escape(null == (pug_interp = place) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 10;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 10;pug_debug_filename = ".\u002Fmetcard.pug";
pug_html = pug_html + (pug.escape(null == (pug_interp = dateStr) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E\u003C\u002Fdiv\u003E";}.call(this,"dateStr" in locals_for_with?locals_for_with.dateStr:typeof dateStr!=="undefined"?dateStr:undefined,"place" in locals_for_with?locals_for_with.place:typeof place!=="undefined"?place:undefined,"tags" in locals_for_with?locals_for_with.tags:typeof tags!=="undefined"?tags:undefined,"text" in locals_for_with?locals_for_with.text:typeof text!=="undefined"?text:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}


compiledFunction({
  id: 5,
  imgSrc: 7,
  text: 5,
  title: 5,
  place: 3,
  tags: [1, 2, 3, 4],
  dateSrc: 4,
});