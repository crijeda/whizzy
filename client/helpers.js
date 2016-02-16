Template.registerHelper('nl2br', function(text) {
  var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
  return new Spacebars.SafeString(nl2br);
});

Template.registerHelper('dateFormat', function(date, format) {
  return moment(date).format(format);
});

Template.registerHelper('shortenString', function(text, maxLength) {
  if (text.length <= maxLength) {
      return text;
  }
  var options = {};
  var defaultOptions = {
      // By default we add an ellipsis at the end
      suffix: true,
      suffixString: "...",
      // By default we preserve word boundaries
      preserveWordBoundaries: true,
      wordSeparator: " "
  };
  $.extend(options, defaultOptions);
  // Compute suffix to use (eventually add an ellipsis)
  var suffix = "";
  if (text.length > maxLength && options.suffix) {
    suffix = options.suffixString;
  }

  // Compute the index at which we have to cut the text
  var maxTextLength = maxLength - suffix.length;
  var cutIndex;
  if (options.preserveWordBoundaries) {
    // We use +1 because the extra char is either a space or will be cut anyway
    // This permits to avoid removing an extra word when there's a space at the maxTextLength index
    var lastWordSeparatorIndex = text.lastIndexOf(options.wordSeparator, maxTextLength+1);
    // We include 0 because if have a "very long first word" (size > maxLength), we still don't want to cut it
    // But just display "...". But in this case the user should probably use preserveWordBoundaries:false...
    cutIndex = lastWordSeparatorIndex > 0 ? lastWordSeparatorIndex : maxTextLength;
  } else {
    cutIndex = maxTextLength;
  }

  var newText = text.substr(0,cutIndex);
  return newText + suffix;
});
