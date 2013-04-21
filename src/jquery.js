(function($) {

  $.jsmine = function(html, data) {
    template = new Template();
    if (data !== undefined)
      $.each(data, function(key, value) {
        template.set(key, value);
      });
    template.setHtml(html);
    return $(template.serve());
  };

})(jQuery);
