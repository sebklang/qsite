function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (entries, isAdmin, room) {pug_html = pug_html + "\u003Cdiv class=\"list\"\u003E";
// iterate entries
;(function(){
  var $$obj = entries;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var entry = $$obj[i];
pug_html = pug_html + "\u003Cdiv class=\"list-entry\"\u003E\u003Cdiv class=\"text list-entry-position\"\u003E" + (pug_escape(null == (pug_interp = i + 1) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv class=\"list-entry-content\"\u003E\u003Cdiv class=\"text list-entry-name\"\u003E" + (pug_escape(null == (pug_interp = entry.name) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
if (entry.description) {
pug_html = pug_html + "\u003Cdiv class=\"text list-entry-description\"\u003E" + (pug_escape(null == (pug_interp = entry.description) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003Cdiv class=\"text list-entry-secondary\"\u003E" + (pug_escape(null == (pug_interp = entry.ageSeconds) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
if ((entry.isDeletable || isAdmin)) {
pug_html = pug_html + "\u003Cform" + (pug_attr("action", `/${room.name}${isAdmin?'/secret':''}`, true, false)+" method=\"post\"") + "\u003E\u003Cinput id=\"delete\" type=\"hidden\" name=\"delete\" value=\"true\"\u002F\u003E\u003Cinput" + (" id=\"roomId\" type=\"hidden\" name=\"roomId\""+pug_attr("value", `${room.id}`, true, false)) + "\u002F\u003E\u003Cinput" + (" id=\"roomName\" type=\"hidden\" name=\"roomName\""+pug_attr("value", `${room.name}`, true, false)) + "\u002F\u003E\u003Cinput" + (" id=\"entryId\" type=\"hidden\" name=\"entryId\""+pug_attr("value", `${entry.id}`, true, false)) + "\u002F\u003E\u003Cbutton class=\"button button-primary\" type=\"submit\"\u003EFinished\u003C\u002Fbutton\u003E\u003C\u002Fform\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var entry = $$obj[i];
pug_html = pug_html + "\u003Cdiv class=\"list-entry\"\u003E\u003Cdiv class=\"text list-entry-position\"\u003E" + (pug_escape(null == (pug_interp = i + 1) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv class=\"list-entry-content\"\u003E\u003Cdiv class=\"text list-entry-name\"\u003E" + (pug_escape(null == (pug_interp = entry.name) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
if (entry.description) {
pug_html = pug_html + "\u003Cdiv class=\"text list-entry-description\"\u003E" + (pug_escape(null == (pug_interp = entry.description) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003Cdiv class=\"text list-entry-secondary\"\u003E" + (pug_escape(null == (pug_interp = entry.ageSeconds) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
if ((entry.isDeletable || isAdmin)) {
pug_html = pug_html + "\u003Cform" + (pug_attr("action", `/${room.name}${isAdmin?'/secret':''}`, true, false)+" method=\"post\"") + "\u003E\u003Cinput id=\"delete\" type=\"hidden\" name=\"delete\" value=\"true\"\u002F\u003E\u003Cinput" + (" id=\"roomId\" type=\"hidden\" name=\"roomId\""+pug_attr("value", `${room.id}`, true, false)) + "\u002F\u003E\u003Cinput" + (" id=\"roomName\" type=\"hidden\" name=\"roomName\""+pug_attr("value", `${room.name}`, true, false)) + "\u002F\u003E\u003Cinput" + (" id=\"entryId\" type=\"hidden\" name=\"entryId\""+pug_attr("value", `${entry.id}`, true, false)) + "\u002F\u003E\u003Cbutton class=\"button button-primary\" type=\"submit\"\u003EFinished\u003C\u002Fbutton\u003E\u003C\u002Fform\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E";}.call(this,"entries" in locals_for_with?locals_for_with.entries:typeof entries!=="undefined"?entries:undefined,"isAdmin" in locals_for_with?locals_for_with.isAdmin:typeof isAdmin!=="undefined"?isAdmin:undefined,"room" in locals_for_with?locals_for_with.room:typeof room!=="undefined"?room:undefined));;return pug_html;}