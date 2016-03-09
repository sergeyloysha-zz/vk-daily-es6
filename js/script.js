chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {

    if(request.action == 'loadData') {
      var seconds = +localStorage.seconds;
      var date = localStorage.date;
      sendResponse({seconds: seconds, date: date});
    }

    if(request.action == 'saveData') {
      localStorage.seconds = request.seconds;
      localStorage.date = request.date;
    }
  }
);

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-74751230-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();