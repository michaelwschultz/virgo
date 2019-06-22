const log = document.querySelector('#log');
let previousEntry = 'first entry';
let count = 1;

['log','debug','info','warn','error'].forEach(function (verb) {
  console[verb] = (function (method, verb, log) {
    return function () {
      method.apply(console, arguments);

      // add counter to previous entry if it's the same
      if (previousEntry.split(" ")[0] === arguments[0].split(" ")[0]) {
        count++;
        log.firstElementChild.innerHTML = `${previousEntry} <span class="badge">${count}</span>`;
        return;
      }

      count = 1;
      var msg = document.createElement('p');
      msg.classList.add(verb);
      if (arguments.length >= 2) {
        msg.textContent = JSON.stringify(arguments, null, 2);
      } else {
        msg.textContent = arguments[0];
        previousEntry = arguments[0];
      }

      log.insertBefore(msg, log.childNodes[0]);
    };
  })(console[verb], verb, log);
});
